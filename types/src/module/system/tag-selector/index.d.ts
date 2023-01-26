export { BasicConstructorOptions, TagSelectorBasic } from "./basic";
export { ResistanceSelector } from "./resistances";
export { SenseSelector } from "./senses";
export { SpeedSelector } from "./speeds";
export { WeaknessSelector } from "./weaknesses";
export { TagSelectorOptions } from "./base";
declare const TAG_SELECTOR_TYPES: readonly ["basic", "resistances", "senses", "speed-types", "weaknesses"];
declare type TagSelectorType = typeof TAG_SELECTOR_TYPES[number];
declare const SELECTABLE_TAG_FIELDS: readonly ["abilities", "actionCategories", "actionTraits", "actionTypes", "actionsNumber", "actorSizes", "alignments", "ancestryItemTraits", "ancestryTraits", "areaSizes", "areaTypes", "armorGroups", "armorPotencyRunes", "armorPropertyRunes", "armorResiliencyRunes", "armorTraits", "armorTypes", "attackEffects", "attributes", "baseWeaponTypes", "bulkTypes", "classTraits", "conditionTypes", "consumableTraits", "consumableTypes", "creatureTraits", "currencies", "damageCategories", "damageDie", "damageTypes", "dcAdjustments", "equipmentTraits", "featTraits", "featTypes", "hazardTraits", "healingTypes", "immunityTypes", "itemBonuses", "languages", "levels", "magicTraditions", "magicTraditions", "martialSkills", "monsterTraits", "npcAttackTraits", "otherArmorTags", "otherEquipmentTags", "otherWeaponTags", "preciousMaterialGrades", "preciousMaterials", "preparationType", "prerequisitePlaceholders", "proficiencyLevels", "rarityTraits", "resistanceTypes", "saves", "senses", "skillList", "skills", "speedTypes", "spellComponents", "spellLevels", "spellTraits", "spellTypes", "traitsDescriptions", "vehicleTraits", "weaknessTypes", "weaponCategories", "weaponDamage", "weaponDescriptions", "weaponGroups", "weaponHands", "weaponMAP", "weaponPotencyRunes", "weaponPropertyRunes", "weaponReload", "weaponStrikingRunes", "weaponTraits"];
declare type SelectableTagField = typeof SELECTABLE_TAG_FIELDS[number];
export { SELECTABLE_TAG_FIELDS, SelectableTagField, TAG_SELECTOR_TYPES, TagSelectorType };
