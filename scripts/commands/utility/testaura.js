/* eslint no-redeclare: "off"*/
import * as Minecraft from "@minecraft/server";

const World = Minecraft.world;

/**
 * @name testaura
 * @param {object} message - Message object
 * @param {array} args - (Optional) Additional arguments provided.
 */

export function testaura(message, args) {
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);
    
    const player = message.sender;
    
    if(args.length === 0) return player.runCommandAsync("function tools/aura");    

    // try to find the player requested
    for (const pl of World.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        var member = pl;
        break;
    }
    
    if(typeof member === "undefined") return player.tell("§r§6[§cPulse§6]§r Couldnt find that player!");

    member.runCommandAsync("function tools/aura");    
}