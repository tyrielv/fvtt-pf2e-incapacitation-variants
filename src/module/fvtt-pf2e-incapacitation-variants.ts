import { CheckPF2e, CheckRollCallback } from "@system/check/check";
import { CheckModifier } from "@actor/modifiers";
import { CheckRollContext } from "@system/check/types";
export const MODULENAME = "fvtt-pf2e-incapacitation-variants";
import * as Settings from "./settings";

const logEnabled = true;

export function log(message: string) {
    if (logEnabled) {
        console.log(`${MODULENAME} | ${message}`);
    }
}

Hooks.once("init", async () => {
    log("Initializing");
    Settings.registerSettings();
});

Hooks.once("setup", async () => {
    log("Setting up");
});

Hooks.once("ready", async () => {
    log("Responding to Foundry ready");
    Hooks.callAll(`${MODULENAME}.moduleReady`);
});

Hooks.once("pf2e.systemReady", async () => {
    wrap();
});

let original: typeof CheckPF2e.roll;

function wrap() {
    // TODO: See if libwrapper works for system methods
    original = game.pf2e.Check.roll.bind(game.pf2e.Check);
    game.pf2e.Check.roll = wrapper;
}

const wrapper = (
    check: CheckModifier,
    context?: CheckRollContext,
    event?: JQuery.TriggeredEvent | null,
    callback?: CheckRollCallback
) => {
    try {
        if (context && hasIncapacitationTrait(context)) {
            rewriteIncapacitation(check, context);
        }
    } catch (error) {
        console.error(error);
    }
    return original(check, context, event, callback);
};

function determineApplies(context: CheckRollContext) {
    const applicationBasis = Settings.getApplicationBasisSetting();
    switch (applicationBasis) {
        case "Level":
            return applyBasedOnLevelDifference(context);
        case "Trait":
            return applyBasedOnTrait(context);
        case "Never":
        default:
            log("Incapacitation trait is disabled");
            break;
    }
    return false;
}

function applyBasedOnLevelDifference(context: CheckRollContext) {
    const levelDifference = Settings.getRequiredLevelDifferenceSetting();
    return incapacitationAppliesBasedOnLevelDifference(context, levelDifference);
}

function applyBasedOnTrait(context: CheckRollContext) {
    const traitName = Settings.getTraitNameSetting().toLowerCase();
    const actor = isSavingThrow(context) ? context.actor : context.target?.actor;
    return actor?.traits.has(traitName) ?? false;
}

function rewriteIncapacitation(check: CheckModifier, context: CheckRollContext) {
    removeSystemIncapacitation(context);

    const applies = determineApplies(context);
    if (applies) {
        log("Applying incapacitation effect");

        const mode = Settings.getIncapacitationEffectSetting();
        switch (mode) {
            case "ImproveWorst2DOS":
                improveWorst2DOS(context);
                break;
            case "ImproveWorstDOS":
                improveWorstDOS(context);
                break;
            case "GiveBonus":
                giveBonus(check, context);
                break;
            case "RollTwice":
                rollTwice(context);
                break;
            case "ImproveAllDOS":
            default:
                improveAllDOS(context);
                break;
        }
    } else {
        log("Incapacitation does not apply");
    }
}

const adjustmentLabel = "IncapacitationVariant";

function improveWorstDOS(context: CheckRollContext) {
    const dosAdjustments = context.dosAdjustments ?? [];
    if (isSavingThrow(context)) {
        dosAdjustments.push({
            adjustments: {
                criticalFailure: {
                    label: adjustmentLabel,
                    amount: 1,
                },
            },
        });
    } else {
        dosAdjustments.push({
            adjustments: {
                criticalSuccess: {
                    label: adjustmentLabel,
                    amount: -1,
                },
            },
        });
    }
    context.dosAdjustments = dosAdjustments;
}

function improveWorst2DOS(context: CheckRollContext) {
    const dosAdjustments = context.dosAdjustments ?? [];
    if (isSavingThrow(context)) {
        dosAdjustments.push({
            adjustments: {
                criticalFailure: {
                    label: adjustmentLabel,
                    amount: 1,
                },
                failure: {
                    label: adjustmentLabel,
                    amount: 1,
                },
            },
        });
    } else {
        dosAdjustments.push({
            adjustments: {
                criticalSuccess: {
                    label: adjustmentLabel,
                    amount: -1,
                },
                success: {
                    label: adjustmentLabel,
                    amount: -1,
                },
            },
        });
    }
    context.dosAdjustments = dosAdjustments;
}

function giveBonus(check: CheckModifier, context: CheckRollContext) {
    log(`Not implemented - giveBonus: ${check}`);
    let bonus = Settings.getBonusAmountSetting();
    if (!isSavingThrow(context)) {
        bonus = -bonus;
    }
    const modifier = new game.pf2e.Modifier({
        label: "PF2E.TraitIncapacitation",
        type: "untyped",
        modifier: bonus,
        enabled: true,
    });
    check.push(modifier);
}

function rollTwice(context: CheckRollContext) {
    context.rollTwice = isSavingThrow(context) ? "keep-higher" : "keep-lower";
}

function improveAllDOS(context: CheckRollContext) {
    const dosAdjustments = context.dosAdjustments ?? [];
    if (isSavingThrow(context)) {
        dosAdjustments.push({
            adjustments: {
                all: {
                    label: adjustmentLabel,
                    amount: 1,
                },
            },
        });
    } else {
        dosAdjustments.push({
            adjustments: {
                all: {
                    label: adjustmentLabel,
                    amount: -1,
                },
            },
        });
    }
    context.dosAdjustments = dosAdjustments;
}

function isSavingThrow(context: CheckRollContext) {
    const type = context.type;
    if (type === "saving-throw") {
        return true;
    }
    if (type && ["attack-roll", "spell-attack-roll", "skill-check"].includes(type)) {
        return false;
    }
    log(`Unexpected context type: ${type}`);
    return false;
}

function hasIncapacitationTrait(context: CheckRollContext) {
    const options = getOptionsSet(context.options);
    return !!options && (options.has("incapacitation") || options.has("item:trait:incapacitation")) && context.dc;
}

function getOptionsSet(rawOptions: any): Set<string> {
    if (rawOptions) {
        if (rawOptions instanceof Set) {
            return rawOptions;
        }
        try {
            const result = new Set(rawOptions as Iterable<string>);
            return result;
        } catch {
            /* empty */
        }
    }
    return new Set<string>();
}

function incapacitationAppliesBasedOnLevelDifference(context: CheckRollContext, requiredLevelDifference: number) {
    const effectLevel = getEffectLevel(context);
    const targetLevel = getTargetLevel(context);
    if (effectLevel === undefined || targetLevel === undefined) {
        return false;
    }

    const levelDifference = targetLevel - effectLevel;
    return levelDifference >= requiredLevelDifference;
}

function getTargetLevel(context: CheckRollContext) {
    const target = context.target;
    const actor = context.actor;
    const level = isSavingThrow(context) && actor ? actor.level : target?.actor.level;
    return level;
}

function removeSystemIncapacitation(context: CheckRollContext) {
    const index =
        context.dosAdjustments?.findIndex((x) => x?.adjustments?.all?.label === "PF2E.TraitIncapacitation") ?? -1;
    if (index >= 0) {
        log("Removed system incapacitation adjustment");
        context!.dosAdjustments!.splice(index, 1);
    }
}

function getEffectLevel(context: CheckRollContext) {
    const item = context.item;
    const actor = context.actor;
    const options = getOptionsSet(context.options);
    const originLevelString = Array.from(options.values() ?? [])
        .find((x) => x.startsWith("origin:level:"))
        ?.substring("origin:level:".length);
    const originLevel = originLevelString ? parseInt(originLevelString) : undefined;

    const setting = Settings.getSpellEffectLevelSetting();

    const effectLevel = item?.isOfType("spell")
        ? setting === "CasterLevel"
            ? originLevel ?? actor?.level ?? 2 * item.level
            : 2 * item.level
        : item?.isOfType("physical")
        ? item.level
        : originLevel ?? actor?.level;
    if (Number.isNaN(effectLevel)) {
        return undefined;
    }
    return effectLevel;
}
