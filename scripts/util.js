import * as Minecraft from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";

const World = Minecraft.world;

/**
 * @name flag
 * @param {Player} player - The player object
 * @param {string} check - What check ran the function.
 * @param {string} checkType - What sub-check ran the function (ex. a, b ,c).
 * @param {string} hackType - What the hack is considered as (ex. movement, combat, exploit).
 * @param {string | undefined} debugName - Name for the debug value.
 * @param {string | undefined} debug - Debug info.
 * @param {boolean} shouldTP - Whever to tp the player to itself.
 * @param {Message | undefined} message - The message object, used to cancel the message.
 * @param {number | undefined} slot - Slot to clear an item out.
 * @example flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg, undefined);
 * @remarks Alerts staff if a player is hacking.
 */
export function flag(player, check, checkType, hackType, debugName, debug, shouldTP = false, message, slot) {
    // validate that required params are defined
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof check !== "string") throw TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if(typeof checkType !== "string") throw TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if(typeof hackType !== "string") throw TypeError(`Error: hackType is type of ${typeof hackType}. Expected "string"`);
    if(typeof debugName !== "string" && typeof debugName !== "undefined") throw TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if(typeof debug !== "string" && typeof debug !== "undefined") throw TypeError(`Error: debug is type of ${typeof debug}. Expected "string" or "undefined"`);
    if(typeof shouldTP !== "boolean") throw TypeError(`Error: shouldTP is type of ${typeof shouldTP}. Expected "boolean"`);
    if(typeof message !== "object" && typeof message !== "undefined") throw TypeError(`Error: message is type of ${typeof message}. Expected "object" or "undefined`);
    if(typeof slot !== "number" && typeof slot !== "undefined") throw TypeError(`Error: slot is type of ${typeof slot}. Expected "nunber" or "undefined`);

    if(typeof debug === "string") {
        // remove characters that may break commands, and newlines
        debug = debug.replace(/"|\\|\n/gm, "");

        // malicous users may try make the debug field ridiclously large to lag any clients that may
        // try to view the alert (anybody with the 'notify' tag)
        if(debug.length > 256) {
            const extraLength = debug.length - 256;
            debug = debug.slice(0, -extraLength) + ` (+${extraLength} additional characters)`;
        }
    }

    // If debug is enabled, then we log everything we know about the player.
    if(config.debug === true) console.warn(`{"timestamp":${Date.now()},"time":"${Date()}","check":"${check}/${checkType}","hackType":"${hackType}","debug":"${debugName}=${debug}§r","shouldTP":${shouldTP},"slot":"${slot}","playerData":{"playerName":"${player.name}","playerNameTag":"${player.nameTag}","lastPlayerName":"${player.oldName}","location":{"x":${player.location.x},"y":${player.location.y},"z":${player.location.z}},"headLocation":{"x":${player.headLocation.x},"y":${player.headLocation.y},"z":${player.headLocation.z}},"velocity":{"x":${player.velocity.x},"y":${player.velocity.y},"z":${player.velocity.z}},"rotation":{"x":${player.rotation.x},"y":${player.rotation.y}},"playerTags":"${String(player.getTags()).replace(/[\r\n"]/gm, "")}","currentItem":"${player.getComponent("inventory").container.getItem(player.selectedSlot)?.id || "minecraft:air"}:${player.getComponent("inventory").container.getItem(player.selectedSlot)?.data || 0}","selectedSlot":${player.selectedSlot},"dimension":"${player.dimension.id}","playerDataExtra":{"blocksBroken":${player.blocksBroken || -1},"entitiesHitCurrentTick":"${player.entitiesHit}","entitiesHitCurrentTickSize":${player.entitiesHit.length || -1},"badpackets5Ticks":${player.badpackets5Ticks || -1},"playerCPS":${player.cps || -1},"firstAttack":${player.firstAttack || -1},"lastSelectedSlot":${player.lastSelectedSlot || -1},"startBreakTime":${player.startBreakTime || -1}}}}`);

    // cancel the message
    if(typeof message === "object") message.cancel = true;

    if(shouldTP === true && check !== "Crasher") player.runCommandAsync("tp @s ~ ~-0.5 ~");
        else if(shouldTP === true && check === "Crasher") player.runCommand("tp @s 30000000 30000000 30000000");

    if(check !== "CommandBlockExploit" && World.scoreboard.getObjective(`${check.toLowerCase()}vl`) === null) {
        player.runCommandAsync(`scoreboard objectives add ${check.toLowerCase()}vl dummy`);
    } 

    if(check !== "CommandBlockExploit") player.runCommandAsync(`scoreboard players add @s ${check.toLowerCase()}vl 1`);
        else player.runCommandAsync("scoreboard players add @s cbevl 1");

    if(debug && check !== "CommandBlockExploit") player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" §6has failed §b§[${hackType}] §c${check}/§g${checkType.toUpperCase()} §7(${debugName}=${debug}§r§7)§9. VL= "},{"score":{"name":"@s","objective":"${check.toLowerCase()}vl"}}]}`);
        else if(debugName && debug) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" §6has failed §b[${hackType}] §c${check}/§g${checkType.toUpperCase()} §7(${debugName}=${debug}§r§7)§9. VL= "},{"score":{"name":"@s","objective":"cbevl"}}]}`);
        else player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" §6has failed §b[${hackType}] §c${check}/§g${checkType.toUpperCase()}.§9 VL= "},{"score":{"name":"@s","objective":"${check.toLowerCase()}vl"}}]}`);

    if(typeof slot === "number") {
		const container = player.getComponent("inventory").container;
		try {
			container.setItem(slot, new Minecraft.ItemStack(Minecraft.MinecraftItemTypes.dirt, 0, 0));
		} catch {}
	}

    const checkData = config.modules[check.toLowerCase() + checkType.toUpperCase()];
    if(typeof checkData !== "object") throw Error(`No valid check data found for ${check}/${checkType}.`);

    if(checkData.enabled === false) throw Error(`${check}/${checkType} was flagged but the module was disabled.`);

    // punishment stuff
    const punishment = checkData.punishment?.toLowerCase();
    if(typeof punishment !== "string") throw TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);
    if(punishment === "none" || punishment === "") return;

    let currentVL;

    if(check === "CommandBlockExploit") currentVL = getScore(player, "cbevl", 1);
        else currentVL = getScore(player, `${check.toLowerCase()}vl`, 1);

    const punishmentLength = checkData.punishmentLength?.toLowerCase();

    if(punishment === "kick" && currentVL >= checkData.minVlbeforePunishment) {
        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" has been automatically kicked by Pulse Anticheat for Unfair Advantage. Check: ${check}/${checkType}"}]}`);
        try {
            player.runCommand(`kick "${player.name}" \n\n§r§6[§cPulse§6]§r ⇝ Unfair Advantage`);
        } catch {
            // if we cant /kick them then we despawn them
            player.triggerEvent("scythe:kick");
        }
    }
    if(punishment === "ban" && currentVL >= checkData.minVlbeforePunishment) {
        if(getScore(player, "autoban", 0) >= 1) {
            player.runCommand('execute @s~ ~ ~ particle minecraft:sonic_explosion ~ ~ ~')
            player.runCommand('summon fireworks_rocket')
            player.runCommand('function tools/resetwarns')
            player.runCommand('title @s title §c §k dkja;klfajds;kflajd;kflajdsflk;ajsdklfjadklfjdlfkjaklfjalsdk');
            player.runCommand('title @s subtitle §c§k lad;fjadslkfjadslkfjadlsfjas;ldfja;sldkfjal;fjdslkfjlskadjfklasdjfakfdsfklajsf');
            player.runCommand('title @s actionbar §c§k falksjf;lkdjfaslkdfjal;kfjasdlkfjasldkjfalskdfal;skdjfas;ldkfjlkasjflkfjd;a;dsafkjdsf;lkjdsflkj');
            player.runCommand('tellraw @s {"rawtext":[{"text":"§k §c al;kdslkasda;sdkflad;sklfjla;sdfjald;sjflaksjfl;kdasjfkadsljfkadlsfjsdlkfjalsdfjal;sdjfldskfjlasdkfjasl;dkfjalsdfjasdl;fajsdfl;aksdjfasldkfjasld;kfjasldfkjaskldfjkasld;fja;lsdkfjasldkfjasdlf;kjadsfal;sdfkjs;dklajsdl;afjfdklasafld;jfdlkjfaljdfsalj;fdas;kjladfj;kslkdfas"}]}');
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" has been banned by Pulse Anticheat for§6 Unfair Advantage. §cCheck: ${check}/${checkType}"}]}`);
            player.runCommandAsync('tellraw @a {"rawtext":[{"text":"§r§6[§cPulse Cheat Detection§6]§r "},{"text":" §cA Player Has Been Removed From Your Game For Using An §6Unfair Advantage!§c§l HACKING WILL RESULT IN A BAN"}]}');
            // this removes old ban stuff
            player.getTags().forEach(t => {
                t = t.replace(/"/g, "");
                if(t.startsWith("reason:") || t.startsWith("by:") || t.startsWith("time:")) player.removeTag(t);
            });

            let banLength;

            if(typeof punishmentLength !== "undefined" && isNaN(punishmentLength) && punishment !== "") {
                banLength = parseTime(punishmentLength);
            }

            player.addTag("by:§cPulse §cAnticheat (Automatic Cheat Detection)");
            player.addTag(`reason:§cPulse §cAnticheat detected §6Unfair Advantage!`);
            if(typeof punishmentLength !== "undefined") player.addTag(`time:${Date.now() + banLength}`);
            player.addTag("isBanned");
        }
    }
    if(punishment === "mute" && currentVL >= checkData.minVlbeforePunishment) {
        player.addTag("isMuted");
        player.tell(`§r§6[§cPulse§6]§r§c You have been muted by Pulse Anticheat for Spamming. §gCheck: ${check}/${checkType}`);
    
        // remove chat ability
        player.runCommandAsync("ability @s mute true");

        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" has been automatically muted by Pulse Anticheat for Spam. Check: ${check}/${checkType}"}]}`);
    }
}

/**
 * @name banMessage
 * @param {Player} player - The player object
 * @example banMessage(player);
 * @remarks Bans the player from the game.
 */
export function banMessage(player) {
    // validate that required params are defined
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    
    if(config.flagWhitelist.includes(player.name) && player.hasTag("op") && typeof player.oldName === "undefined") return;
    if(data.unbanQueue.includes(player.name.toLowerCase().split(" ")[0])) {
        player.removeTag("isBanned");

        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" has been found in the unban queue and has been unbanned."}]}`);

        player.getTags().forEach(t => {
            t = t.replace(/"/g, "");
            if(t.startsWith("reason:") || t.startsWith("by:") || t.startsWith("time:")) player.removeTag(t);
        });

        // remove the player from the unban queue
        for (let i = -1; i < data.unbanQueue.length; i++) {
            if(data.unbanQueue[i] == player.name.toLowerCase().split(" ")[0]) {
                data.unbanQueue.splice(i, 1);
                break;
            }
        }
        return;
    }

    let reason;
    let by;
    let time;

    player.getTags().forEach(t => {
        t = t.replace(/"/g, "");
        if(t.startsWith("by:")) by = t.slice(3);
            else if(t.startsWith("reason:")) reason = t.slice(7);
            else if(t.startsWith("time:")) time = t.slice(5);
    });


    if(typeof time !== "undefined") {
        if(time < Date.now()) {
            player.runCommand('tag @s remove killauraBan');
            player.runCommand('function tools/resetwarns');
            player.runCommand('tellraw @s {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"text":" You Have Been Unbanned! Reason: Your Ban Has Expired"}]}`);');
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":"'s ban has expired and has now been unbanned."}]}`);

            // ban expired, woo
            player.removeTag("isBanned");
            player.getTags().forEach(t => {
                t = t.replace(/"/g, "");
                if(t.startsWith("reason:") || t.startsWith("by:") || t.startsWith("time:")) player.removeTag(t);
            });
            return;
        }

        time = msToTime(Number(time));
        time = `${time.w} weeks, ${time.d} days, ${time.h} hours, ${time.m} minutes, ${time.s} seconds`;
    }
    
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r ${player.name} was kicked for: ${reason}."}]}`);

    try {
        player.runCommand('summon lightning_bolt')
        player.runCommand('execute @s~ ~ ~ particle minecraft:sonic_explosion ~ ~ ~')
        player.runCommand('execute @s~ ~ ~ particle minecraft:lava ~ ~ ~')
        player.runCommand('summon fireworks_rocket')
        player.runCommand(`kick "${player.name}" §r\n§l§cYOU ARE §4BANNED!§r§a Appeal at: ${config.appeal} \n§r§eBanned By:§r ${by || "N/A"}\n§bReason:§r ${reason || "N/A"}\n§aBan Length:§r ${time || "Permenant"}`);
    } catch {
        player.triggerEvent("scythe:kick");
    }
}

/**
 * @name getClosestPlayer
 * @param {Entity} entity - The entity to check
 * @example getClosestPlayer(entity);
 * @remarks Gets the nearest player to an entity.
 * @returns {Player} player - The player that was found
 */
 export function getClosestPlayer(entity) {
    // validate that required params are defined
    if(typeof entity !== "object") return TypeError(`Error: entity is type of ${typeof entity}. Expected "object"`);

    // thx https://discord.com/channels/523663022053392405/854033525546942464/948349809746669629

    let closestPlayer;

    for (const player of World.getPlayers()) {
    
        const nearestPlayer = [...player.dimension.getPlayers({closest: 1, location: player.location})][0];
    
        if(!nearestPlayer) continue;

        closestPlayer = player;
    }

    return closestPlayer;
}

/**
 * @name parseTime
 * @param {string} str - The time value to convert to milliseconds
 * @example parseTime("24d"); // returns 2073600000
 * @remarks Parses a time string into milliseconds.
 * @returns {string} str - The converted string
 */
export function parseTime(str) {
    // validate that required params are defined
    if(typeof str !== "string") throw TypeError(`Error: str is type of ${typeof str}. Expected "string"`);

    // parse time values like 12h, 1d, 10m into milliseconds
    const time = str.match(/^(\d+)([smhdwy])$/);
    if(time) {
        const [, num, unit] = time;
        const ms = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000,
            w: 604800000,
            y: 31536000000
        }[unit];
        return ms * num;
    }
    return time;
}

/**
 * @name msToTime
 * @param {string} ms - The string to convert
 * @example str(88200000); // Returns { d: 1, h: 0, m: 30, s: 0 }
 * @remarks Convert miliseconds to seconds, minutes, hours, days and weeks
 * @returns {string} str - The converted string
 */
export function msToTime(ms) {
    // validate that required params are defined
    if(typeof ms !== "number") throw TypeError(`Error: ms is type of ${typeof ms}. Expected "number"`);

    if(ms > Date.now()) ms = ms - Date.now();

    // turn miliseconds into days, minutes, seconds, etc
    const w = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
    const d = Math.floor((ms % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return {
        w: w,
        d: d,
        h: h,
        m: m,
        s: s
    };
}

/**
 * @name getScore
 * @param {Player} player - The player to get the scoreboard value from
 * @param {string} objective - The player to get the scoreboard value from
 * @param {number} defaultValue? - Default value to return if unable to get scoreboard score
 * @example getScore(player, "cbevl", 0)
 * @remarks Convert miliseconds to seconds, minutes, hours, days and weeks
 * @returns {number} score - The scoreboard objective value
 */
 export function getScore(player, objective, defaultValue = 0) {
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof objective !== "string") throw TypeError(`Error: objective is type of ${typeof objective}. Expected "string"`);
    if(typeof defaultValue !== "number") throw TypeError(`Error: defaultValue is type of ${typeof defaultValue}. Expected "number"`);

    try {
       return World.scoreboard.getObjective(objective).getScore(player.scoreboard);
    } catch {
        return defaultValue;
    }
}
