//Adapted from https://github.com/xdy/xdy-pf2e-workbench/blob/main/webpack.config.ts

import * as path from "path";
import * as fs from "fs-extra";
import * as os from "os";
import webpack from "webpack";
import { Configuration as WebpackDevServerConfiguration, Request } from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import SimpleProgressWebpackPlugin from "simple-progress-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const buildMode = process.argv[3] === "production" ? "production" : "development";
const isProductionBuild = buildMode === "production";

interface Configuration extends Omit<webpack.Configuration, "devServer"> {
    devServer?: Omit<WebpackDevServerConfiguration, "proxy"> & {
        // the types in typescript are wrong for this, so we're doing it live here.
        proxy?: {
            context: (pathname: string, _request: Request) => boolean;
            target: string;
            ws: boolean | undefined;
        };
    };
}

const [outDir, foundryUri] = ((): [string, string] => {
    const configPath = path.resolve(process.cwd(), "foundryconfig.json");
    const config = fs.readJSONSync(configPath, { throws: false });
    const outDir =
        config instanceof Object
            ? path.join(config.dataPath, "Data", "modules", config.systemName ?? "fvtt-pf2e-incapacitation-variants")
            : path.join(__dirname, "dist/");
    const foundryUri = (config instanceof Object ? String(config.foundryUri) : "") ?? "http://localhost:30000";
    return [outDir, foundryUri];
})();

/** Create an empty static files when in dev mode to keep the Foundry server happy */
class EmptyStaticFilesPlugin {
    apply(compiler: webpack.Compiler): void {
        compiler.hooks.afterEmit.tap("EmptyStaticFilesPlugin", (): void => {
            if (!isProductionBuild) {
                fs.closeSync(fs.openSync(path.resolve(outDir, "vendor.bundle.js"), "w"));
            }
        });
    }
}

type Optimization = Configuration["optimization"];
const optimization: Optimization = isProductionBuild
    ? {
        minimize: true,
        minimizer: [
            new TerserPlugin({ terserOptions: { mangle: false, module: true, keep_classnames: true } }),
        ],
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                default: {
                    name: "fvtt-pf2e-incapacitation-variants",
                    test: "src/module/fvtt-pf2e-incapacitation-variants.ts",
                },
                vendor: {
                    name: "vendor",
                    test: /node_modules/,
                },
            },
        },
    }
    : undefined;

    const config: Configuration = {
        context: __dirname,
        mode: buildMode,
        entry: {
            main: "./src/module/fvtt-pf2e-incapacitation-variants.ts",
        },
        module: {
            rules: [
                !isProductionBuild
                    ? {
                        test: /\.html$/,
                        loader: "raw-loader",
                    }
                    : {
                        test: /\.html$/,
                        loader: "null-loader",
                    },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: path.resolve(__dirname, "tsconfig.json"),
                                happyPackMode: true,
                                transpileOnly: true,
                                compilerOptions: {
                                    noEmit: false,
                                },
                            },
                        },
                        "webpack-import-glob-loader",
                    ],
                },
                {
                    loader: "thread-loader",
                    options: {
                        workers: os.cpus().length + 1,
                        poolRespawn: false,
                        poolTimeout: isProductionBuild ? 500 : Infinity,
                    },
                },
            ],
        },
        optimization: optimization,
        devtool: isProductionBuild ? undefined : "inline-source-map",
        watch: !isProductionBuild,
        bail: isProductionBuild,
        devServer: {
            hot: true,
            devMiddleware: {
                writeToDisk: true,
            },
            proxy: {
                context: (pathname: string, _request: Request) => {
                    return !pathname.match("^/ws");
                },
                target: foundryUri,
                ws: true,
            },
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin({
                BUILD_MODE: JSON.stringify(buildMode),
            }),
            new CopyPlugin({
                patterns: [
                    { from: "module.json" },
                    {
                        from: "packs/*.db",
                        noErrorOnMissing: true,
                    },
                    {
                        from: "static/",
                        transform(content: Buffer, absoluteFrom: string) {
                            if (path.basename(absoluteFrom) === "en.json") {
                                return JSON.stringify(JSON.parse(content.toString()));
                            }
                            return content;
                        },
                    },
                ],
            }),
            new SimpleProgressWebpackPlugin({ format: "compact" }),
            new EmptyStaticFilesPlugin(),
        ],
        resolve: {
            alias: {
                "@actor": path.resolve(__dirname, "types/src/module/actor"),
                "@item": path.resolve(__dirname, "types/src/module/item"),
                "@module": path.resolve(__dirname, "types/src/module"),
                "@scene": path.resolve(__dirname, "types/src/module/scene"),
                "@scripts": path.resolve(__dirname, "types/src/scripts"),
                "@system": path.resolve(__dirname, "types/src/module/system"),
                "@util": path.resolve(__dirname, "types/src/util"),
            },
            extensions: [".ts", ".js"],
        },
        output: {
            clean: true,
            path: outDir,
            filename: "fvtt-pf2e-incapacitation-variants.bundle.js",
        },
    };

    // eslint-disable-next-line import/no-default-export
    export default config;
