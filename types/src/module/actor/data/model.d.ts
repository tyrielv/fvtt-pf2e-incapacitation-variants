import type { ActorPF2e } from "@actor";
import type { MigrationDataField } from "@module/data.ts";
import type { AutoChangeEntry } from "@module/rules/rule-element/ae-like.ts";
import fields = foundry.data.fields;
declare abstract class ActorSystemModel<TParent extends ActorPF2e, TSchema extends ActorSystemSchema> extends foundry.abstract
    .TypeDataModel<TParent, TSchema> {
    autoChanges: Record<string, AutoChangeEntry[] | undefined>;
    static defineSchema(): ActorSystemSchema;
}
type ActorSystemSchema = {
    _migration: MigrationDataField;
};
/** Schema definition for actor hit points, though not all actors have hit points */
type ActorHitPointsSchema = {
    value: fields.NumberField<number, number, true, false, true>;
    max: fields.NumberField<number, number, true, false, true>;
    temp: fields.NumberField<number, number, true, false, true>;
    details: fields.StringField<string, string, true, false, true>;
};
export { ActorSystemModel };
export type { ActorHitPointsSchema, ActorSystemSchema };
