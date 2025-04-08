import { ChatMessagePF2e } from "@module/chat-message";
import { MODULENAME } from "./fvtt-pf2e-incapacitation-variants";
import * as Settings from "./settings";
import { TokenPF2e } from "@module/canvas";

const groupNumberEffectSourceId = "Item.BhX29Jk5Hod0IDpc";
export async function runTests() {
    const level1Message = game.messages.find(x => x.actor?.level === 1 && x.item?.name === "Charm")!;
    if (level1Message == undefined) {
        ui.notifications.error("Cast charm from level 1 actor with rank 1 spell");
    }
    const level11Message = game.messages.find(x => x.actor?.level === 11 && x.item?.name === "Charm")!;
    if (level1Message == undefined) {
        ui.notifications.error("Cast charm from level 11 actor with rank 1 spell");
    }

    await cleanUpRolls();
    await setConfigToDefaults();

    var result = await runTestCase(1, level1Message, 'default');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.HPThreshold, 50);
    var result = await runTestCase(2, level1Message, 'HP Threshold 50');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.ApplicationBasis, "Trait");
    var result = await runTestCase(3, level1Message, 'Boss trait');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.RequiredLevelDifference, 5);
    var result = await runTestCase(4, level1Message, 'Level difference 5');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.SpellEffectLevel, "CasterLevel");
    var result = await runTestCase(5, level11Message, 'Caster level 11');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.SpellEffectLevel, "CasterLevel");
    var result = await runTestCase(6, level1Message, 'Caster level 1');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.SpellEffectLevel, "BetterOfSlotLevelOrCasterLevel")
    var result = await runTestCase(7, level11Message, 'Caster level 11 better of level/2xrank');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.SpellEffectLevel, "BetterOfSlotLevelOrCasterLevel")
    var result = await runTestCase(8, level1Message, 'Caster level 1 better of level/2xrank');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "ImproveWorstDOS");
    var result = await runTestCase(9, level1Message, 'Improve crit fails only');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "ImproveWorst2DOS");
    var result = await runTestCase(10, level1Message, 'Improve fails');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "GiveBonus");
    await game.settings.set(MODULENAME, Settings.Keys.BonusAmount, 1);
    var result = await runTestCase(11, level1Message, 'Add a bonus(1)');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "ScaleDOSImprovementsWithHP");
    var result = await runTestCase(12, level1Message, 'Scale with HP');
    if (!result) { return;}

    await setConfigToDefaults();
    await game.settings.set(MODULENAME, Settings.Keys.IncapacitationEffect, "RollTwice");
    var result = await runTestCaseRollTwiceKeepHigher(13, level1Message);
    if (!result) { return;}

    ui.notifications.info(`All passed`);
}

async function runTestCaseRollTwiceKeepHigher(groupNumber: number, message: ChatMessagePF2e)
{
    const tokens = selectTokensWithGroupNumber(groupNumber);
    await clickSaveButton(message!, tokens);
    let toCheck = Array.from(game.messages).filter(x => x.isRoll);
    if (toCheck.length != tokens.length) {
        ui.notifications.error("Number of rolls didn't match number of tokens");
    }
    let anyFailed = false;
    for (let i = 0; i < toCheck.length; i++) {
        let m = toCheck[i];
        if (m.token?.name === "Normal crit success") {
            if (m.rolls[0].formula.indexOf('kh') >= 0) {
                anyFailed = true;
                ui.notifications.error(`Roll twice keep higher - ${m.token?.name} test failed`);
            }
        }
        else {
            if (m.rolls[0].formula.indexOf('kh') < 0) {
                anyFailed = true;
                ui.notifications.error(`Roll twice keep higher - ${m.token?.name} test failed`);
            }
        }
        if (!anyFailed) {
            await m.delete();
        }
    }
    if (anyFailed) {
        return false;
    }
    await waitForMessagesToBeDeleted(toCheck);
    return true;
}

async function runTestCase(groupNumber: number, message: ChatMessagePF2e, name: string)
{
    const tokens = selectTokensWithGroupNumber(groupNumber)
    const rolls = await clickSaveButton(message!, tokens);
    if (rolls.length != tokens.length) {
        ui.notifications.error("Number of rolls didn't match number of tokens");
    }
    let result = await verifyRolls(rolls, name);
    return result;
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

async function clickSaveButton(message: ChatMessagePF2e, tokens: TokenPF2e[]) {
    const messageNode = document.querySelector(`[data-message-id="${message.id}"]`)
    const button = messageNode?.querySelector('button')!;
    return await checkIfDoneRolling(button, tokens);
}

async function checkIfDoneRolling(button: HTMLButtonElement, tokens: TokenPF2e[]) {
    while (true) {
        button.click();
        if (tokens.length == 0) {
            throw "Expected some controlled tokens, but none were selected";
        }
        const missing = tokens.filter(t => game.messages.find(m => m.token?.id === t.id) == undefined);
        if (missing.length > 0) {
            await new Promise(r => setTimeout(r, 10));
        }
        else {
            return game.messages.filter(m => tokens.find(t => m.token?.id === t.id) != undefined);
        }
    }
}

function selectTokensWithGroupNumber(groupNumber: number) {
    const tokens = getTokensWithGroupNumber(groupNumber);
    selectTokens(tokens);
    return tokens;
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

async function verifyRolls(toCheck: ChatMessagePF2e[], testName: string) {
    let anyFailed = false;
    for (let i = 0; i < toCheck.length; i++) {
        let m = toCheck[i];
        if (m.actor!.name != m.rolls[0].degreeOfSuccess) {
            anyFailed = true;
            ui.notifications.error(`${testName} - ${m.token?.name} test failed`);
        }
        else {
            await m.delete();
        }
    }
    if (anyFailed) {
        return false;
    }
    await waitForMessagesToBeDeleted(toCheck);

    return !anyFailed;
}

async function waitForMessagesToBeDeleted(toCheck: ChatMessagePF2e[]) {
    let allDeleted = false;
    while (!allDeleted) {
        allDeleted = true;
        for (let i = 0; i < toCheck.length; i++) {
            const m = toCheck[i];
            const message = document.querySelector(`[data-message-id="${m.id}"]`);
            if (message !== null) {
                allDeleted = false;
            }
        }
        if (!allDeleted) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}

async function cleanUpRolls() {
    let toCheck = Array.from(game.messages).filter(x => x.isRoll)
    for (let i = 0; i < toCheck.length; i++) {
        let m = toCheck[i];
        await m.delete();
    }
    for (let i = 0; i < toCheck.length; i++) {
        let m = toCheck[i];
        while (document.querySelector(`[data-message-id="${m.id}"]`)) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}
