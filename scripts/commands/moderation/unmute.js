import * as Minecraft from "@minecraft/server";

const World = Minecraft.world;

/**
 * @name unmute
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function unmute(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(args.length === 0) return player.tell("§r§6[§cPulse§6]§r You need to provide who to unmute!");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    // try to find the player requested
    for (const pl of World.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        var member = pl;
        break;
    }
    
    if(typeof member === "undefined") return player.tell("§r§6[§cPulse§6]§r Couldn't find that player!");

    try {
        member.removeTag("isMuted");
        member.tell("§r§6[§cPulse§6]§r You have been unmuted.");
    
        // add chat ability
        member.runCommandAsync("ability @s mute false");
    } catch (error) {
        console.warn(`${new Date()} | ` + error);
        return player.tell("§r§6[§cPulse§6]§r I was unable to unmute that player.");
    }
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"text":"${player.nameTag} has unmuted ${member.nameTag}. Reason: ${reason}"}]}`);
}
