import type { ActorPF2e } from "@actor";
import type { ItemSourcePF2e, ItemType } from "./base/data/index.ts";
import type { ItemPF2e } from "./base/document.ts";
import type { PhysicalItemPF2e } from "./physical/document.ts";
import type { ItemInstances } from "./types.ts";
type ItemOrSource = PreCreate<ItemSourcePF2e> | ItemPF2e;
/** Determine in a type-safe way whether an `ItemPF2e` or `ItemSourcePF2e` is among certain types */
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(item: ItemOrSource, ...types: TType[]): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(item: ItemOrSource, ...types: TType[]): item is TType extends "physical" ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"] : TType extends ItemType ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"] : never;
declare function itemIsOfType<TParent extends ActorPF2e | null>(item: ItemOrSource, type: "physical"): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
/** Create a "reduced" item name; that is, one without an "Effect:" or similar prefix */
declare function reduceItemName(label: string): string;
/**
 * Performs late prep tasks on an item that doesn't exist in the actor, such as a cloned one.
 * If the item isn't embedded, nothing happens.
 */
declare function performLatePreparation(item: ItemPF2e): void;
declare function markdownToHTML(markdown: string): string;
export { itemIsOfType, markdownToHTML, performLatePreparation, reduceItemName };
