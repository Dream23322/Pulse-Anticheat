import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";

const World = Minecraft.world;

/**
 * @name ban
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function ban(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(args.length === 0) return player.tell("§r§6[§cPulse§6]§r You need to provide who to ban!");

    let time;
    if(typeof args[1] === "string") time = parseTime(args[1]);

    if(typeof time !== "undefined") args.splice(1, 1);

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    // try to find the player requested
    for (const pl of World.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        var member = pl;
        break;
    }

    if(typeof member === "undefined") return player.tell(`§r§6[§cPulse§6]§r Couldn't find ${member}!`);

    // make sure they dont ban themselves
    if(member.nameTag === player.nameTag) return player.tell("§r§6[§cPulse§6]§r You cannot ban yourself.");

    // cannot ban staff members
    if(member.hasTag("op") === true) return player.tell("§r§6[§cPulse§6]§r You cannot ban other staff members!.");

    // this removes old ban stuff
    member.getTags().forEach(t => {
        t = t.replace(/"/g, "");
        if(t.startsWith("reason:") || t.startsWith("by:") || t.startsWith("time:")) member.removeTag(t);
    });

    member.addTag(`reason:${reason}`);
    member.addTag(`by:${player.nameTag}`);
    if(typeof time !== "undefined") member.addTag(`time:${Date.now() + time}`);
    member.addTag("isBanned");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"text":"${player.nameTag} has banned ${member.nameTag}. Reason: ${reason}"}]}`);
}
