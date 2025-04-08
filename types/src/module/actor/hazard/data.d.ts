import { ActorAttributes, ActorDetails, ActorHitPoints, BaseActorSourcePF2e } from "@actor/data/base.ts";
import { Immunity, Resistance, Weakness } from "@actor/data/iwr.ts";
import { ActorHitPointsSchema, ActorSystemModel, ActorSystemSchema } from "@actor/data/model.ts";
import type { ActorSizePF2e } from "@actor/data/size.ts";
import type { InitiativeTraceData } from "@actor/initiative.ts";
import type { NPCStrike } from "@actor/npc/index.ts";
import type { ImmunityType, ResistanceType, WeaknessType } from "@actor/types.ts";
import type { Rarity, Size } from "@module/data.ts";
import { PublicationField } from "@module/model.ts";
import { DataUnionField } from "@system/schema-data-fields.ts";
import type { StatisticTraceData } from "@system/statistic/data.ts";
import type { HazardPF2e } from "./document.ts";
import type { HazardTrait } from "./types.ts";
import fields = foundry.data.fields;
/** The stored source data of a hazard actor */
type HazardSource = BaseActorSourcePF2e<"hazard", HazardSystemSource>;
declare class HazardSystemData extends ActorSystemModel<HazardPF2e, HazardSystemSchema> {
    static defineSchema(): HazardSystemSchema;
}
interface HazardSystemData extends ActorSystemModel<HazardPF2e, HazardSystemSchema>, ModelPropsFromSchema<HazardSystemSchema> {
    traits: HazardTraits;
    attributes: HazardAttributes;
    details: HazardDetails;
    actions: NPCStrike[];
    initiative?: InitiativeTraceData;
}
type HazardSystemSchema = ActorSystemSchema & {
    /** Traits, languages, and other information. */
    traits: fields.SchemaField<HazardTraitsSchema>;
    attributes: fields.SchemaField<HazardAttributesSchema, SourceFromSchema<HazardAttributesSchema>, HazardAttributes>;
    details: fields.SchemaField<HazardDetailsSchema>;
    saves: fields.SchemaField<{
        fortitude: fields.SchemaField<HazardSaveDataSchema>;
        reflex: fields.SchemaField<HazardSaveDataSchema>;
        will: fields.SchemaField<HazardSaveDataSchema>;
    }>;
};
type HazardTraitsSchema = {
    value: fields.ArrayField<fields.StringField<HazardTrait, HazardTrait, true, false, false>>;
    rarity: fields.StringField<Rarity, Rarity, true, false, true>;
    size: fields.SchemaField<{
        value: fields.StringField<Size, Size, true, false, true>;
    }>;
};
interface HazardTraits extends ModelPropsFromSchema<HazardTraitsSchema> {
    size: ActorSizePF2e;
}
type HazardSaveDataSchema = {
    value: fields.NumberField<number, number, true, false, true>;
};
type HazardAttributesSchema = {
    hp: fields.SchemaField<ActorHitPointsSchema, SourceFromSchema<ActorHitPointsSchema>, ActorHitPoints>;
    ac: fields.SchemaField<{
        value: fields.NumberField<number, number, true, false, true>;
    }>;
    hardness: fields.NumberField<number, number, true, false, true>;
    stealth: fields.SchemaField<{
        value: fields.NumberField<number, number, true, true, true>;
        details: fields.StringField<string, string, true, false, true>;
    }>;
    immunities: fields.ArrayField<fields.SchemaField<{
        type: fields.StringField<ImmunityType, ImmunityType, true, false, false>;
        exceptions: fields.ArrayField<fields.StringField<ImmunityType, ImmunityType, true, false, false>>;
    }>>;
    weaknesses: fields.ArrayField<fields.SchemaField<{
        type: fields.StringField<WeaknessType, WeaknessType, true, false, false>;
        value: fields.NumberField<number, number, true, false, true>;
        exceptions: fields.ArrayField<fields.StringField<WeaknessType, WeaknessType, true, false, false>>;
    }>>;
    resistances: fields.ArrayField<fields.SchemaField<{
        type: fields.StringField<ResistanceType, ResistanceType, true, false, false>;
        value: fields.NumberField<number, number, true, false, true>;
        exceptions: fields.ArrayField<fields.StringField<ResistanceType, ResistanceType, true, false, false>>;
        doubleVs: fields.ArrayField<fields.StringField<ResistanceType, ResistanceType, true, false, false>>;
    }>>;
    emitsSound: DataUnionField<fields.StringField<"encounter", "encounter", true, false, false> | fields.BooleanField<boolean, boolean, true, false, false>, true, false, true>;
};
type HazardAttributesSource = SourceFromSchema<HazardAttributesSchema>;
type HazardDetailsSchema = {
    description: fields.StringField<string, string, true, false, true>;
    level: fields.SchemaField<{
        value: fields.NumberField<number, number, true, false, true>;
    }>;
    isComplex: fields.BooleanField<boolean, boolean, true, false, true>;
    disable: fields.StringField<string, string, true, false, true>;
    routine: fields.StringField<string, string, true, false, true>;
    reset: fields.StringField<string, string, true, false, true>;
    /** Information concerning the publication from which this actor originates */
    publication: PublicationField;
};
/** The raw information contained within the actor data object for hazards. */
interface HazardSystemSource extends SourceFromSchema<HazardSystemSchema> {
    schema?: never;
}
interface HazardAttributes extends ActorAttributes, Omit<HazardAttributesSource, AttributesSourceOmission> {
    ac: {
        value: number;
    };
    hp: HazardHitPoints;
    hasHealth: boolean;
    stealth: HazardStealthTraceData;
    immunities: Immunity[];
    weaknesses: Weakness[];
    resistances: Resistance[];
    shield?: never;
}
type AttributesSourceOmission = "immunities" | "weaknesses" | "resistances";
interface HazardStealthTraceData extends Omit<StatisticTraceData, "dc" | "totalModifier" | "value"> {
    dc: number | null;
    totalModifier: number | null;
    value: number | null;
    details: string;
}
interface HazardDetails extends ActorDetails, SourceFromSchema<HazardDetailsSchema> {
    alliance: null;
}
interface HazardHitPoints extends ActorHitPoints {
    brokenThreshold: number;
}
export { HazardSystemData, type HazardSource };
