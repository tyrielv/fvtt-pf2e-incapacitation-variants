import { MODULENAME, log, setLogEnabled } from "./fvtt-pf2e-incapacitation-variants";

export function registerSettings() {
    log("registerSettings");

    game.settings.register(MODULENAME, "debugLogs", {
        name: `${MODULENAME}.SETTINGS.debugLogs.name`,
        hint: `${MODULENAME}.SETTINGS.debugLogs.hint`,
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: loadLogEnabled,
    });
    loadLogEnabled();

    game.settings.register(MODULENAME, "SpellEffectLevel", {
        name: `${MODULENAME}.SETTINGS.SpellEffectLevel.name`,
        hint: `${MODULENAME}.SETTINGS.SpellEffectLevel.hint`,
        scope: "world",
        config: true,
        default: "slotLevel",
        type: String,
    });

    game.settings.register(MODULENAME, "RequiredLevelDifference", {
        name: `${MODULENAME}.SETTINGS.RequiredLevelDifference.name`,
        hint: `${MODULENAME}.SETTINGS.RequiredLevelDifference.hint`,
        scope: "world",
        config: true,
        default: 1,
        type: Number,
    });

    game.settings.register(MODULENAME, "IncapacitationEffect", {
        name: `${MODULENAME}.SETTINGS.IncapacitationEffect.name`,
        hint: `${MODULENAME}.SETTINGS.IncapacitationEffect.hint`,
        scope: "world",
        config: true,
        default: "ImproveAllDOS",
        type: String,
        choices: IncapacitationEffectChoices,
    });

    game.settings.register(MODULENAME, "BonusAmount", {
        name: `${MODULENAME}.SETTINGS.BonusAmount.name`,
        hint: `${MODULENAME}.SETTINGS.BonusAmount.hint`,
        scope: "world",
        config: true,
        default: 5,
        type: Number,
    });
}

export function getSpellEffectLevelSetting(): SpellEffectLevel {
    return game.settings.get(MODULENAME, "SpellEffectLevel") as SpellEffectLevel;
}

export function getRequiredLevelDifferenceSetting(): number {
    return game.settings.get(MODULENAME, "RequiredLevelDifference") as number;
}

export function getIncapacitationEffectSetting(): IncapacitationEffect {
    return game.settings.get(MODULENAME, "IncapacitationEffect") as IncapacitationEffect;
}

export function getBonusAmountSetting(): number {
    return game.settings.get(MODULENAME, "BonusAmount") as number;
}

function loadLogEnabled() {
    setLogEnabled(!!game.settings.get(MODULENAME, "debugLogs"));
}

export type SpellEffectLevel = "slotLevel" | "casterLevel";

const IncapacitationEffectChoices = {
    ImproveAllDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveAllDOS`),
    ImproveWorstDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveWorstDOS`),
    ImproveWorst2DOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveWorst2DOS`),
    RollTwice: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.RollTwice`),
    GiveBonus: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.GiveBonus`),
};

export type IncapacitationEffect = keyof typeof IncapacitationEffectChoices;
