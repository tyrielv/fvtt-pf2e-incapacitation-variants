import { MODULENAME, log } from "./fvtt-pf2e-incapacitation-variants";

export const Keys = {
    HPThreshold: "HPThreshold",
    ApplicationBasis: "ApplicationBasis",
    RequiredLevelDifference: "RequiredLevelDifference",
    TraitName: "TraitName",
    SpellEffectLevel: "SpellEffectLevel",
    IncapacitationEffect: "IncapacitationEffect",
    BonusAmount: "BonusAmount",
}

export function registerSettings() {
    log("registerSettings");

    game.settings.register(MODULENAME, Keys.HPThreshold, {
        name: `${MODULENAME}.SETTINGS.${Keys.HPThreshold}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.HPThreshold}.hint`,
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        range: {
            min: 0,
            max: 99,
            step: 1,
        },
    });

    game.settings.register(MODULENAME, Keys.ApplicationBasis, {
        name: `${MODULENAME}.SETTINGS.${Keys.ApplicationBasis}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.ApplicationBasis}.hint`,
        scope: "world",
        config: true,
        default: "Level",
        type: String,
        choices: {
            Level: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.ApplicationBasis}.Level`),
            Trait: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.ApplicationBasis}.Trait`),
            Never: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.ApplicationBasis}.Never`),
        },
    });

    game.settings.register(MODULENAME, Keys.RequiredLevelDifference, {
        name: `${MODULENAME}.SETTINGS.${Keys.RequiredLevelDifference}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.RequiredLevelDifference}.hint`,
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: -20,
            max: 20,
            step: 1,
        },
    });

    game.settings.register(MODULENAME, Keys.TraitName, {
        name: `${MODULENAME}.SETTINGS.${Keys.TraitName}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.TraitName}.hint`,
        scope: "world",
        config: true,
        default: "boss",
        type: String,
    });

    game.settings.register(MODULENAME, Keys.SpellEffectLevel, {
        name: `${MODULENAME}.SETTINGS.${Keys.SpellEffectLevel}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.SpellEffectLevel}.hint`,
        scope: "world",
        config: true,
        default: "slotLevel",
        type: String,
        choices: {
            SlotLevel: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.SpellEffectLevel}.SlotLevel`),
            CasterLevel: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.SpellEffectLevel}.CasterLevel`),
            BetterOfSlotLevelOrCasterLevel: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.SpellEffectLevel}.BetterOfSlotLevelOrCasterLevel`),
        },
    });

    game.settings.register(MODULENAME, Keys.IncapacitationEffect, {
        name: `${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.hint`,
        scope: "world",
        config: true,
        default: "ImproveAllDOS",
        type: String,
        choices: {
            ImproveAllDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.ImproveAllDOS`),
            ImproveWorstDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.ImproveWorstDOS`),
            ImproveWorst2DOS: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.ImproveWorst2DOS`),
            RollTwice: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.RollTwice`),
            GiveBonus: game.i18n.localize(`${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.GiveBonus`),
            ScaleDOSImprovementsWithHP: game.i18n.localize(
                `${MODULENAME}.SETTINGS.${Keys.IncapacitationEffect}.ScaleDOSImprovementsWithHP`
            ),
        },
    });

    game.settings.register(MODULENAME, Keys.BonusAmount, {
        name: `${MODULENAME}.SETTINGS.${Keys.BonusAmount}.name`,
        hint: `${MODULENAME}.SETTINGS.${Keys.BonusAmount}.hint`,
        scope: "world",
        config: true,
        default: 5,
        type: Number,
    });
}

export function getSpellEffectLevelSetting(): SpellEffectLevel {
    return game.settings.get(MODULENAME, Keys.SpellEffectLevel) as SpellEffectLevel;
}

export function getRequiredLevelDifferenceSetting(): number {
    return game.settings.get(MODULENAME, Keys.RequiredLevelDifference) as number;
}

export function getIncapacitationEffectSetting(): IncapacitationEffect {
    return game.settings.get(MODULENAME, Keys.IncapacitationEffect) as IncapacitationEffect;
}

export function getApplicationBasisSetting(): ApplicationBasis {
    return game.settings.get(MODULENAME, Keys.ApplicationBasis) as ApplicationBasis;
}

export function getBonusAmountSetting(): number {
    return game.settings.get(MODULENAME, Keys.BonusAmount) as number;
}

export function getHpThreshold(): number {
    return game.settings.get(MODULENAME, Keys.HPThreshold) as number;
}

export function getTraitNameSetting() {
    return game.settings.get(MODULENAME, Keys.TraitName) as string;
}

export type SpellEffectLevel = "SlotLevel" | "CasterLevel" | "BetterOfSlotLevelOrCasterLevel";

export type IncapacitationEffect =
    | "ImproveAllDOS"
    | "ImproveWorstDOS"
    | "ImproveWorst2DOS"
    | "GiveBonus"
    | "RollTwice"
    | "ScaleDOSImprovementsWithHP";

export type ApplicationBasis = "Level" | "Trait" | "Never";
