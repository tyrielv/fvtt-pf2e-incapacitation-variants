import { ChatMessagePF2e } from "@module/chat-message";
import { MODULENAME } from "./fvtt-pf2e-incapacitation-variants";
import * as Settings from "./settings";
import { TokenPF2e } from "@module/canvas";

const groupNumberEffectSourceId = "Item.BhX29Jk5Hod0IDpc";
export async function runTests() {
    const level1Message = game.messages.find(x => x.actor?.level === 1 && x.item?.name === "Charm");
    if (level1Message === undefined) {
        ui.notifications.error("Cast charm from level 1 actor");
    }

    await setConfigToDefaults();
    console.log("test");
    selectTokensWithGroupNumber(1);
    await clickSaveButton(level1Message!);
}

async function setConfigToDefaults() {
    await game.settings.set(MODULENAME, Settings.Keys.HPThreshold, 0);
    await game.settings.set(MODULENAME, Settings.Keys.ApplicationBasis, "Level");
    await game.settings.set(MODULENAME, Settings.Keys.RequiredLevelDifference, 1);
    await game.settings.set(MODULENAME, Settings.Keys.TraitName, "boss");
    await game.settings.set(MODULENAME, Settings.Keys.SpellEffectLevel, "SlotLevel");
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "ImproveAllDOS");
    await game.settings.set(MODULENAME, Settings.Keys.BonusAmount, 5);
}

function clickSaveButton(message: ChatMessagePF2e) {
    const messageNode = document.querySelector(`[data-message-id="${message.id}"]`)
    const button = messageNode?.querySelector('button')!;
    const result = new Promise((resolve, _) => {
        button.addEventListener('click', resolve);
        button.click();
        button.removeEventListener('click', resolve);
    });
    return result;
}

function selectTokensWithGroupNumber(groupNumber: number) {
    const tokens = getTokensWithGroupNumber(groupNumber);
    selectTokens(tokens);
}

function selectTokens(tokens: TokenPF2e[]) {
    canvas.tokens.releaseAll();
    tokens.forEach(t => t.control({ releaseOthers: false }));
}

function getTokensWithGroupNumber(groupNumber: number) {
    const tokens = canvas.tokens.objects.children as TokenPF2e[];
    return tokens.filter(t => {
        const matches = t.actor?.items.filter(i => {
            if (i.sourceId != groupNumberEffectSourceId) {
                return false;
            }
            const data = i.system as { badge?: { value?: number } };
            if (data?.badge?.value === groupNumber) {
                return true;
            }
            return false;
        });
        return (matches?.length ?? 0) > 0;
    });
}

async function verifyRolls(testName: string) {
    let toCheck = Array.from(game.messages).filter(x => x.isRoll)
    let anyFailed = false;
    for (let i = 0; i < toCheck.length; i++) {
        let m = toCheck[i];
        if (m.actor!.name != m.rolls[0].degreeOfSuccess) {
            anyFailed = true;
            ui.notifications.error(`${m.token.name} test failed`);
        }
        else {
            await m.delete();
        }
    }
    if (!anyFailed) {
        ui.notifications.info("All passed");
    }
}
