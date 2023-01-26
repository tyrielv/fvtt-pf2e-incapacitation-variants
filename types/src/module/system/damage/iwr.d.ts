import { ActorPF2e } from "@actor";
import { DamageRoll } from "./roll";
/** Apply an actor's IWR applications to an evaluated damage roll's instances */
declare function applyIWR(actor: ActorPF2e, roll: Rolled<DamageRoll>): IWRApplicationData;
interface IWRApplicationData {
    finalDamage: number;
    applications: IWRApplication[];
}
interface UnafectedApplication {
    category: "unaffected";
    type: string;
    adjustment: number;
}
interface ImmunityApplication {
    category: "immunity";
    type: string;
    adjustment: number;
}
interface WeaknessApplication {
    category: "weakness";
    type: string;
    adjustment: number;
}
interface ResistanceApplication {
    category: "resistance";
    type: string;
    adjustment: number;
}
type IWRApplication = UnafectedApplication | ImmunityApplication | WeaknessApplication | ResistanceApplication;
export { IWRApplication, IWRApplicationData, applyIWR };
