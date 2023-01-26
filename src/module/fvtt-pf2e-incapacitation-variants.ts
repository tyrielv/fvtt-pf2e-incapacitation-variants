import { CheckPF2e, CheckRollCallback } from "@system/check/check";
import { CheckModifier } from "@actor/modifiers";
import { CheckRollContext } from "@system/check/types";
export const MODULENAME = "fvtt-pf2e-incapacitation-variants";
import * as Settings from "./settings";

let logEnabled = true;

export function setLogEnabled(newValue: boolean) {
    logEnabled = newValue;
}

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
    if (context && hasIncapacitationTrait(context)) {
        rewriteIncapacitation(context);
    }
    return original(check, context, event, callback);
};

function rewriteIncapacitation(context: CheckRollContext) {
    removeSystemIncapacitation(context);
    const levelDifference = Settings.getRequiredLevelDifferenceSetting();
    const applies = incapacitationAppliesBasedOnLevelDifference(context, levelDifference);
    if (applies) {
        log("Applying incapacitation effect");

        const mode = Settings.getIncapacitationEffectSetting();
        switch (mode) {
            case "ImproveWorst2DOS":
                break;
            case "ImproveWorstDOS":
                break;
            case "GiveBonus":
                break;
            case "RollTwice":
                break;
            case "ImproveAllDOS":
            default:
                break;
        }
    } else {
        log("Incapacitation does not apply");
    }
}

function hasIncapacitationTrait(context: CheckRollContext) {
    const options = context.options;
    return !!options && (options.has("incapacitation") || options.has("item:trait:incapacitation")) && context.dc;
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
    const type = context.type ?? "";
    const actor = context.actor;
    const level =
        type === "saving-throw" && actor
            ? actor.level
            : ["attack-roll", "spell-attack-roll", "skill-check"].includes(type) && target
            ? target.actor.level
            : undefined;
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
    const originLevelString = Array.from(context.options?.values() ?? [])
        .find((x) => x.startsWith("origin:level:"))
        ?.substring("origin:level:".length);
    const originLevel = originLevelString ? parseInt(originLevelString) : undefined;

    const setting = Settings.getSpellEffectLevelSetting();

    const effectLevel = item?.isOfType("spell")
        ? setting === "casterLevel"
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
