const eslint = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const importX = require("eslint-plugin-import-x");
const prettier = require("eslint-plugin-prettier/recommended");
const { createTypeScriptImportResolver } = require("eslint-import-resolver-typescript");

module.exports = [
    {
        ignores: ["node_modules/**", "dist/**", ".cs/**", ".vscode/**", "foundryconfig.json", "submodules/**"]
    },
    eslint.configs.recommended,
    ...tseslint.configs["flat/recommended"],
    importX.flatConfigs.errors,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname
            }
        },
        settings: {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                    project: "./tsconfig.json"
                })
            ]
        },
        rules: {
            eqeqeq: ["error", "always"],
            "import-x/named": "off",
            "import-x/no-default-export": "error",
            "no-console": "off",
            "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
            "spaced-comment": "error",
            "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/prefer-namespace-keyword": "off",
            "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unused-vars": "off"
        }
    },
    prettier
];
