import type { ActorAttributes, ActorDetails, ActorHitPoints, BaseActorSourcePF2e } from "@actor/data/base.ts";
import type { Resistance, Weakness } from "@actor/data/iwr.ts";
import { Immunity } from "@actor/data/iwr.ts";
import { ActorHitPointsSchema, ActorSystemModel, ActorSystemSchema } from "@actor/data/model.ts";
import { ActorSizePF2e } from "@actor/data/size.ts";
import type { ActorAlliance, ImmunityType, ResistanceType, WeaknessType } from "@actor/types.ts";
import type { Rarity, Size } from "@module/data.ts";
import { PublicationField } from "@module/model.ts";
import { DataUnionField } from "@system/schema-data-fields.ts";
import type { ArmorClassTraceData } from "@system/statistic/armor-class.ts";
import type { VehiclePF2e } from "./document.ts";
import type { VehicleTrait } from "./types.ts";
import fields = foundry.data.fields;
/** The stored source data of a vehicle actor */
type VehicleSource = BaseActorSourcePF2e<"vehicle", VehicleSystemSource>;
declare class VehicleSystemData extends ActorSystemModel<VehiclePF2e, VehicleSystemSchema> {
    attributes: VehicleAttributes;
    alliance: ActorAlliance;
    static defineSchema(): VehicleSystemSchema;
    prepareBaseData(): void;
}
interface VehicleSystemData extends ActorSystemModel<VehiclePF2e, VehicleSystemSchema>, ModelPropsFromSchema<VehicleSystemSchema> {
    traits: VehicleTraits;
    attributes: VehicleAttributes;
    details: VehicleDetails;
}
type VehicleSystemSchema = ActorSystemSchema & {
    traits: fields.SchemaField<VehicleTraitsSchema>;
    attributes: fields.SchemaField<VehicleAttributesSchema, SourceFromSchema<VehicleAttributesSchema>, VehicleAttributes>;
    details: fields.SchemaField<VehicleDetailsSchema>;
    saves: fields.SchemaField<{
        fortitude: fields.SchemaField<{
            value: fields.NumberField<number, number, true, false, true>;
        }>;
    }>;
};
type VehicleTraitsSchema = {
    value: fields.ArrayField<fields.StringField<VehicleTrait, VehicleTrait, true, false, false>>;
    rarity: fields.StringField<Rarity, Rarity, true, false, true>;
    size: fields.SchemaField<{
        value: fields.StringField<Size, Size, true, false, true>;
    }>;
};
interface VehicleTraits extends ModelPropsFromSchema<VehicleTraitsSchema> {
    size: ActorSizePF2e;
}
type VehicleAttributesSchema = {
    hp: fields.SchemaField<ActorHitPointsSchema, SourceFromSchema<ActorHitPointsSchema>, VehicleHitPoints>;
    ac: fields.SchemaField<{
        value: fields.NumberField<number, number, true, false, true>;
    }>;
    hardness: fields.NumberField<number, number, true, false, true>;
    collisionDC: fields.SchemaField<{
        value: fields.NumberField<number, number, true, false, true>;
    }>;
    collisionDamage: fields.SchemaField<{
        value: fields.StringField<string, string, true, false, true>;
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
type VehicleAttributesSource = SourceFromSchema<VehicleAttributesSchema>;
type VehicleDetailsSchema = {
    description: fields.StringField<string, string, true, false, true>;
    level: fields.SchemaField<{
        value: fields.NumberField<number, number, true, false, true>;
    }>;
    price: fields.NumberField<number, number, true, false, true>;
    space: fields.SchemaField<{
        long: fields.NumberField<number, number, true, false, true>;
        wide: fields.NumberField<number, number, true, false, true>;
        high: fields.NumberField<number, number, true, false, true>;
    }>;
    crew: fields.StringField<string, string, true, false, true>;
    passengers: fields.StringField<string, string, true, false, true>;
    pilotingCheck: fields.StringField<string, string, true, false, true>;
    AC: fields.NumberField<number, number, true, false, true>;
    speed: fields.StringField<string, string, true, false, true>;
    /** Information concerning the publication from which this actor originates */
    publication: PublicationField;
};
interface VehicleSystemSource extends SourceFromSchema<VehicleSystemSchema> {
    schema?: never;
}
interface VehicleHitPoints extends ActorHitPoints {
    brokenThreshold: number;
}
interface VehicleAttributes extends ActorAttributes, Omit<VehicleAttributesSource, AttributesSourceOmission> {
    ac: ArmorClassTraceData;
    hp: VehicleHitPoints;
    immunities: Immunity[];
    weaknesses: Weakness[];
    resistances: Resistance[];
    initiative?: never;
    shield?: never;
}
type AttributesSourceOmission = "immunities" | "weaknesses" | "resistances";
interface VehicleDetails extends ActorDetails, SourceFromSchema<VehicleDetailsSchema> {
}
interface TokenDimensions {
    width: number;
    height: number;
}
export { VehicleSystemData };
export type { TokenDimensions, VehicleSource, VehicleTrait };
