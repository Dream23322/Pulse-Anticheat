/**
 * @name vanish
 * @param {object} message - Message object
 */
export function vanish(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    try {
        player.runCommand("function tools/vanish");
    } catch (error) {
        if(JSON.parse(error).statusMessage === "Function tools/vanish not found.") {
            player.tell("§r§6[§cPulse§6]§r For this command to function, please enable Spectator Mode in world settings.");
            return;
        } else throw Error(error);
    }
}
