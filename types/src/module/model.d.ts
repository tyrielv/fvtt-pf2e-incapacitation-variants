import type { Rarity } from "./data.ts";
import fields = foundry.data.fields;
declare class RarityField extends fields.StringField<Rarity, Rarity, true, false, true> {
    constructor();
}
declare class PublicationField extends fields.SchemaField<PublicationSchema, SourceFromSchema<PublicationSchema>, ModelPropsFromSchema<PublicationSchema>, true, false, true> {
    constructor();
}
/** Schema definition for an actor's sourcebook */
type PublicationSchema = {
    title: fields.StringField<string, string, true, false, true>;
    authors: fields.StringField<string, string, true, false, true>;
    license: fields.StringField<"ORC" | "OGL", "ORC" | "OGL", true, false, true>;
    remaster: fields.BooleanField;
};
export { PublicationField, RarityField };
