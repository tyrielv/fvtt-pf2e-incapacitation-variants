import { MODULENAME, log } from "./fvtt-pf2e-incapacitation-variants";

export function registerSettings() {
    log("registerSettings");

    game.settings.register(MODULENAME, "ApplicationBasis", {
        name: `${MODULENAME}.SETTINGS.ApplicationBasis.name`,
        hint: `${MODULENAME}.SETTINGS.ApplicationBasis.hint`,
        scope: "world",
        config: true,
        default: "levelDifference",
        type: String,
        choices: {
            Level: game.i18n.localize(`${MODULENAME}.SETTINGS.ApplicationBasis.Level`),
            Trait: game.i18n.localize(`${MODULENAME}.SETTINGS.ApplicationBasis.Trait`),
            Never: game.i18n.localize(`${MODULENAME}.SETTINGS.ApplicationBasis.Never`),
        },
    });

    game.settings.register(MODULENAME, "RequiredLevelDifference", {
        name: `${MODULENAME}.SETTINGS.RequiredLevelDifference.name`,
        hint: `${MODULENAME}.SETTINGS.RequiredLevelDifference.hint`,
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

    game.settings.register(MODULENAME, "TraitName", {
        name: `${MODULENAME}.SETTINGS.TraitName.name`,
        hint: `${MODULENAME}.SETTINGS.TraitName.hint`,
        scope: "world",
        config: true,
        default: "boss",
        type: String,
    });

    game.settings.register(MODULENAME, "SpellEffectLevel", {
        name: `${MODULENAME}.SETTINGS.SpellEffectLevel.name`,
        hint: `${MODULENAME}.SETTINGS.SpellEffectLevel.hint`,
        scope: "world",
        config: true,
        default: "slotLevel",
        type: String,
        choices: {
            SlotLevel: game.i18n.localize(`${MODULENAME}.SETTINGS.SpellEffectLevel.SlotLevel`),
            CasterLevel: game.i18n.localize(`${MODULENAME}.SETTINGS.SpellEffectLevel.CasterLevel`),
        },
    });

    game.settings.register(MODULENAME, "IncapacitationEffect", {
        name: `${MODULENAME}.SETTINGS.IncapacitationEffect.name`,
        hint: `${MODULENAME}.SETTINGS.IncapacitationEffect.hint`,
        scope: "world",
        config: true,
        default: "ImproveAllDOS",
        type: String,
        choices: {
            ImproveAllDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveAllDOS`),
            ImproveWorstDOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveWorstDOS`),
            ImproveWorst2DOS: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.ImproveWorst2DOS`),
            RollTwice: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.RollTwice`),
            GiveBonus: game.i18n.localize(`${MODULENAME}.SETTINGS.IncapacitationEffect.GiveBonus`),
        },
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

export function getApplicationBasisSetting(): ApplicationBasis {
    return game.settings.get(MODULENAME, "ApplicationBasis") as ApplicationBasis;
}

export function getBonusAmountSetting(): number {
    return game.settings.get(MODULENAME, "BonusAmount") as number;
}

export function getTraitNameSetting() {
    return game.settings.get(MODULENAME, "TraitName") as string;
}

export type SpellEffectLevel = "SlotLevel" | "CasterLevel";

export type IncapacitationEffect = "ImproveAllDOS" | "ImproveWorstDOS" | "ImproveWorst2DOS" | "GiveBonus" | "RollTwice";

export type ApplicationBasis = "Level" | "Trait" | "Never";
