import * as Minecraft from "@minecraft/server";
import { flag, banMessage, getClosestPlayer, getScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";

const World = Minecraft.world;

if(config.debug === true) console.warn(`${new Date()} | Im not a dumbass and this actually worked :sunglasses:`);

World.events.beforeChat.subscribe(msg => {
    const message = msg.message.toLowerCase();
    const player = msg.sender;

    if(config.debug === true && message === "ping") console.warn(`${new Date()} | Pong!`);

    if(message.includes("the best minecraft bedrock utility mod") || message.includes("disepi/ambrosial")) msg.cancel = true;

    if(player.hasTag("isMuted")) {
        msg.cancel = true;
        player.tell("§r§6[§cPulse§6]§r §1§lNOPE! §r§cYou have been muted.");
    }

    // BadPackets/2 = checks for invalid chat message lengths
    if(config.modules.badpackets2.enabled === true && message.length > config.modules.badpackets2.maxlength || message.length < config.modules.badpackets2.minLength) flag(player, "BadPackets", "2", "Exploit", "messageLength", `${message.length}`, undefined, msg);

    // Spammer/A = checks if someone sends a message while moving and on ground
    if(config.modules.spammerA.enabled === true && player.hasTag('moving') && player.hasTag('ground') && !player.hasTag('jump'))
        return flag(player, "Spammer", "A", "Movement", undefined, undefined, true, msg);

    // Spammer/B = checks if someone sends a message while swinging their hand
    if(config.modules.spammerB.enabled === true && player.hasTag('left') && !player.getEffect(Minecraft.MinecraftEffectTypes.miningFatigue))
        return flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg);

    // Spammer/C = checks if someone sends a message while using an item
    if(config.modules.spammerC.enabled === true && player.hasTag('right'))
        return flag(player, "Spammer", "C", "Misc", undefined, undefined, undefined, msg);

    // Spammer/D = checks if someone sends a message while having a GUI open
    if(config.modules.spammerD.enabled === true && player.hasTag('hasGUIopen'))
        return flag(player, "Spammer", "D", "Misc", undefined, undefined, undefined, msg);

    commandHandler(player, msg);

    // add's user custom tags to their messages if it exists or we fall back
    // also filter for non ASCII characters and remove them in messages
    if(player.name !== player.nameTag && !msg.cancel && !config.modules.filterUnicodeChat) {
        World.say(`<${player.nameTag}> ${msg.message.replace(/"/g, "").replace(/\\/g, "")}`);
        msg.cancel = true;
    } else if(player.name === player.nameTag && config.modules.filterUnicodeChat && !msg.cancel) {
        World.say(`<${player.nameTag}> ${msg.message.replace(/[^\x00-\xFF]/g, "").replace(/"/g, "").replace(/\\/g, "")}`);
        msg.cancel = true;
    }
});

function checkPlayer() {
Minecraft.system.run(({ currentTick }) => {
    if(config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;

    // run as each player
    for (const player of World.getPlayers()) {
        try {

        if(player.isGlobalBanned === true) {
            try {
                player.addTag("by:Pulse Anticheat");
                player.addTag("reason:You are Pulse Anticheat global banned!");
                player.addTag("isBanned");
            } catch {}
        }

        if(config.modules.banA.enabled && player.hasTag("killauraBan")) {
            flag(player, "ban", "Ban", "A", false, false, false)
        }
            

        // sexy looking ban message
        if(player.hasTag("isBanned")) banMessage(player);

        if(player.blocksBroken !== 0 && config.modules.nukerA.enabled === true) player.blocksBroken = 0;
        if(player.entitiesHit !== [] && config.modules.killauraC.enabled === true) player.entitiesHit = [];
        if(Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay) {
            // console.warn(1, player.lastSelectedSlot, player.selectedSlot);
            if(player.lastSelectedSlot !== player.selectedSlot) player.flagAutotoolA = true;
        }

        // BadPackets[5] = checks for horion freecam
        if(config.modules.badpackets5.enabled && player.velocity.y.toFixed(6) === "0.420000" && !player.hasTag("dead")) {
            player.badpackets5Ticks++;
            if(player.badpackets5Ticks > 2) flag(player, "BadPackets", "5", "Exploit", "yVelocity", player.velocity.y.toFixed(6), true);
        } else if(player.badpackets5Ticks !== 0) player.badpackets5Ticks--;

        // Crasher/A = invalid pos check
        if(config.modules.crasherA.enabled && Math.abs(player.location.x) > 30000000 ||
            Math.abs(player.location.y) > 30000000 || Math.abs(player.location.z) > 30000000) 
                flag(player, "Crasher", "A", "Exploit", "x_pos", `${player.location.x},y_pos=${player.location.y},z_pos=${player.location.z}`, true);

        // anti-namespoof
        // these values are set in the playerJoin config
        if(player.flagNamespoofA === true) {
            flag(player, "Namespoof", "A", "Exploit", "nameLength", player.name.length);
            player.flagNamespoofA = false;
        }
        if(player.flagNamespoofB === true) {
            flag(player, "Namespoof", "B", "Exploit");
            player.flagNamespoofB = false;
        }
        if(player.flagNamespoofC === true) {
            flag(player, "Namespoof", "C", "Exploit", "oldName", player.oldName);
            player.flagNamespoofC = false;
        }

        // player position shit
        if(player.hasTag("moving")) {
            player.runCommandAsync(`scoreboard players set @s xPos ${Math.floor(player.location.x)}`);
            player.runCommandAsync(`scoreboard players set @s yPos ${Math.floor(player.location.y)}`);
            player.runCommandAsync(`scoreboard players set @s zPos ${Math.floor(player.location.z)}`);
        }

        if(config.modules.bedrockValidate.enabled === true) {
            if(getScore(player, "bedrock") >= 1) {
                if(config.modules.bedrockValidate.overworld && player.dimension.id === "minecraft:overworld") {
                    player.runCommandAsync("fill ~-5 -64 ~-5 ~5 -64 ~5 bedrock");
                    player.runCommandAsync("fill ~-4 -59 ~-4 ~4 319 ~4 air 0 replace bedrock");
                }

                if(config.modules.bedrockValidate.nether && player.dimension.id === "minecraft:nether") { 
                    player.runCommandAsync("fill ~-5 0 ~-5 ~5 0 ~5 bedrock");
                    player.runCommandAsync("fill ~-5 127 ~-5 ~5 127 ~5 bedrock");
                    player.runCommandAsync("fill ~-5 5 ~-5 ~5 120 ~5 air 0 replace bedrock");
                }
            } else config.modules.bedrockValidate.enabled = false;
        }

        const playerSpeed = Math.sqrt(Math.abs(player.velocity.x**2 + player.velocity.z**2)).toFixed(2);

        // if(config.debug === true) console.warn(`${new Date()} | ${player.name}'s speed: ${playerSpeed.toFixed(4)} Vertical Speed: ${player.velocity.y}`);

        // NoSlow/A = speed limit check
        if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed) {
            if(!player.getEffect(Minecraft.MinecraftEffectTypes.speed) && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right", 0) >= 5) {
                flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
            }
        }

        const container = player.getComponent('inventory').container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if(typeof item === "undefined") continue;

            // Illegalitems/C = item stacked over 64 check
            if(config.modules.illegalitemsC.enabled && item.amount > config.modules.illegalitemsC.maxStack)
                flag(player, "IllegalItems", "C", "Exploit", "stack", item.amount, undefined, undefined, i);
                
            // Illegalitems/D = additional item clearing check
            if(config.modules.illegalitemsD.enabled && config.itemLists.items_very_illegal.includes(item.typeId))
                flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);

            // CommandBlockExploit/H = clear items
            if(config.modules.commandblockexploitH.enabled && config.itemLists.cbe_items.includes(item.typeId))
                flag(player, "CommandBlockExploit", "H", "Exploit", "item", item.typeId, undefined, undefined, i);
                
            // Illegalitems/F = Checks if an item has a name longer then 32 characters
            if(config.modules.illegalitemsF.enabled && item.nameTag?.length > config.modules.illegalitemsF.length)
                flag(player, "IllegalItems", "F", "Exploit", "name", `${item.nameTag},length=${item.nameTag.length}`, undefined, undefined, i);
		
            // AntiShulker/A = Checks for shulkers
            if(config.modules.antishulkerA.enabled) {
                if(config.modules.antishulkerA.normalShulkers.includes(item.typeId) && !player.hasTag("op") || config.modules.antishulkerA.antiBypass === true && config.itemLists.antiBypassItems.includes(item.typeId) && !player.hasTag("op")) {
                    try {
                        player.runCommand("testfor @s[m=!c]")
                        flag(player, "AntiShulker", "A", "Exploit", `Item=${item.typeId}`, false, false);
                        player.runCommandAsync("clear @s");
                    } catch {}
                }
            }
            // BadEnchants/D = checks if an item has a lore
            if(config.modules.badenchantsD.enabled && item.getLore().length) {
                if(!config.modules.badenchantsD.exclusions.includes(String(item.getLore())))
                    flag(player, "BadEnchants", "D", "Exploit", "lore", String(item.getLore()), undefined, undefined, i);
            }

            if((config.modules.badenchantsA.enabled || config.modules.badenchantsB.enabled || config.modules.badenchantsC.enabled) && currentTick % 2) {
                const itemEnchants = item.getComponent("enchantments").enchantments;

                /*
                    As of 1.19.30, Mojang removed all illegal items from MinecraftItemTypes, although this change
                    doesnt matter, they mistakenly removed 'written_book', which can be obtained normally.
                    Written books will make this code error out, and make any items that havent been check bypass
                    anti32k checks. In older versions, this error will also make certian players not get checked
                    leading to a Scythe Semi-Gametest Disabler method.
                */
                let itemType = Minecraft.ItemTypes.get(item.typeId);
                if(typeof itemType === "undefined") itemType = Minecraft.ItemTypes.get("minecraft:book");

                const item2 = new Minecraft.ItemStack(itemType, 1, item.data);
                const item2Enchants = item2.getComponent("enchantments").enchantments;

                for (const enchantment in Minecraft.MinecraftEnchantmentTypes) {
                    const enchantData = itemEnchants.getEnchantment(Minecraft.MinecraftEnchantmentTypes[enchantment]);

                    if(typeof enchantData === "object") {
                        // badenchants/A = checks for items with invalid enchantment levels
                        if(config.modules.badenchantsA.enabled === true) {
                            const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];
                            if(typeof maxLevel === "number") {
                                if(enchantData.level > maxLevel) flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                            } else if(enchantData.level > Minecraft.MinecraftEnchantmentTypes[enchantment].maxLevel)
                                flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                        }
						
                        // badenchants/B = checks for negative enchantment levels
                        if(config.modules.badenchantsB.enabled && enchantData.level <= 0)
                            flag(player, "BadEnchants", "B", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);

                        // badenchants/C = checks if an item has an enchantment which isnt support by the item
                        if(config.modules.badenchantsC.enabled) {
                            if(!item2.getComponent("enchantments").enchantments.canAddEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantment], 1))) {
                                flag(player, "BadEnchants", "C", "Exploit", "item", `${item.typeId},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                            }

                            if(config.modules.badenchantsB.multi_protection === true) {
                                item2Enchants.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantData.type.id], 1));
                                item2.getComponent("enchantments").enchantments = item2Enchants;
                            }
                        }
                    }
                }
            }
        }

        // invalidsprint/a = checks for sprinting with the blindness effect
        if(config.modules.invalidsprintA.enabled && player.getEffect(Minecraft.MinecraftEffectTypes.blindness) && player.hasTag('sprint'))
            flag(player, "InvalidSprint", "A", "Movement", undefined, undefined, true);

        // InvalidSprint/E = checks if a player is sprinting without actually moving
        if(config.modules.movementB.enabled === true && player.velocity.x === 0 && player.velocity.z === 0 && player.hasTag("sprint")) {
            if(config.modules.movementB.enabled === true && player.velocity.x === 0 && player.velocity.z === 0 && player.hasTag("sprint") && player.hasTag("ground")) {
                if(typeof player.scoreboard !== "undefined" && World.scoreboard.getObjective("invalidsprint")?.getScore(player.scoreboard) >= 1)
                    flag(player, "movement", "B", "Movement", undefined, undefined, true);
            }
        }
            
        // Movement/a
        if(config.modules.movementA.enabled && Math.abs(player.velocity.y).toFixed(4) === "0.1552" && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
            const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);

            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");

            if(isNotInAir === false) flag(player, "Movement", "A", "Movement", "vertical_speed", Math.abs(player.velocity.y).toFixed(4), true);
                else if(config.debug === true) console.warn(`${new Date()} | ${player.name} was detected with flyA motion but was found near solid blocks.`);
        }
        // Movement/C = Checks for the weird TP like speed movement
        if(config.modules.movementC.enabled) {
            const position1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            if(player.velocity.x == 0 || player.velocity.y == 0) {
                const position2 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
                const distance = Math.abs(position1 - position2);
                if(distance > config.modules.movementC.minDistance && distance < config.modules.movementC.maxDistance)
                    flag(player, "Movement", "C", "Movement", `distance=${distance}`, false, false)
            }
        }   
            
        // Speed/A = Checks for unaturall speed
        if(config.modules.speedA.enabled) {
            if(playerSpeed > config.modules.speedA.speed && !player.getEffect(Minecraft.MinecraftEffectTypes.speed))
                flag(player, "Speed", "A", "Movement", `speed=${playerSpeed}`, false, false)
        }
        
        // speed/b = strafe speed (This was a fuck hell to stop false flags)
        if(config.modules.strafeB.enabled && Math.abs(player.velocity.y).toFixed(4) === "0.1552" && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving") && !player.hasTag('noMovement') && playerSpeed.toFixed(2) >= 0.127)
            flag(player, "Strafe", "B", "Movement", false, false, false)
        
        // Autoclicker/A = checks for high CPS
        if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
            player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
            if(player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);

            // player.runCommandAsync(`say ${player.cps}, ${player.lastCPS}. ${player.cps - player.lastCPS}`);

            player.firstAttack = Date.now();
            player.cps = 0;
        }
        // Autoclicker/B = checks for similar cps
        if(config.modules.autoclickerB.enabled) {
            player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
            let cpsDiff = Math.abs(player.cps - player.lastCPS);
            if(player.cps > config.modules.autoclickerB.minCPS && cpsDiff > config.modules.autoclickerB.minCpsDiff && cpsDiff < config.modules.autoclickerB.maxCpsDiff) flag(player, "AutoClicker", "B", "Combat", "CPS", `${player.cps},last_cps=${player.lastCPS}`);
            player.lastCPS = player.cps;
        }
		// BadPackets[4] = checks for invalid selected slot
        if(config.modules.badpackets4.enabled && player.selectedSlot < 0 || player.selectedSlot > 8) {
            flag(player, "BadPackets", "4", "Exploit", "selectedSlot", `${player.selectedSlot}`);
            player.selectedSlot = 0;
        }
    
        } catch (error) {
            console.warn(error, error.stack);
            if(player.hasTag("errorlogger")) player.tell(`§r§6[§cPulse§6]§r There was an error while running the tick event. Please forward this message to https://discord.gg/9m9TbgJ973.\n-------------------------\n${String(error).replace(/"|\\/g, "")}\n${error.stack || "\n"}-------------------------`);
        }
    }
    checkPlayer();
});
}

World.events.blockPlace.subscribe((blockPlace) => {
    const block = blockPlace.block;
    const player = blockPlace.player;
    const diff = Math.abs(data.lastYaw - player.getLocation().getYaw())
    
    if(config.debug === true) console.warn(`${player.nameTag} has placed ${block.typeId}.`);

    //scaffold/A = checks for placing more than 1 block in a tick
    if(config.modules.scaffoldA.enabled) {
        //makes blocksPlaced
        player.blocksPlaced++;

        if(blocksPlaced.player > 1)
            flag(player, "Scaffold", "A", "Placement", false, false, false);
            // Stops block Placement
            blockPlace.cancel = true;
    }

    //Scaffold/B = checks for placing a block and attacking at the same time
    if(config.modules.scaffoldB.enabled && player.hasTag("left")) {
        if(blockPlace.player)
            flag(player, "Scaffold", "B", "Placement", false, false, false);
            blockPlace.cancle = true;

    }
    //Scaffold/B (2) = checks for placing a block and attacking at the same time
    if(config.modules.scaffoldB.enabled && player.hasTag("left") && player.hasTag("right")) {
        flag(player, "Scaffold", "B", "Placement", false, false, false);
    }
    
    //Scaffold/C = checks for placing a block and going very fast at the same time
    if(config.modules.scaffoldC.enabled && !player.hasTag("op")) {
        if(playerSpeed >= config.modules.scaffoldC.speed) {
            try{
                player.runCommand("testfor @s[m=!c]");
                flag(player, "Scaffold", "C", "Placement", `speed=${playerSpeed}`, false, false);
                blockPlace.cancle = true;
            } catch {}
        }
    }
    // Scaffold/D = placing a block while using an item
    if(config.modules.scaffoldD.enabled) {
        if(player.hasTag("right") && blockPlace.player)
            flag(player, "Scaffold", "D", "Placement", false, false, false);
            blockPlace.cancle = true;
    }
    
    //Scaffold/E = Checks for large changed in rotation
    if(blockPlace.player) {
        if(config.modules.scaffoldE.enabled && player.hasTag("left")) {
            if(diff >= config.modules.scaffoldE.maxRotationDiff)
                flag(player, "Scaffold", "E", "Placement", false, false, false)
        }
    
    }
    //Scaffold/F
    if(blockPlace.player && !player.hasTag("left")) {
        if(!player.hasTag("left"))
            flag(player, "Scaffold", "F", "Placement", false, false, false)
    }


    

    // IllegalItems/H = checks for pistons that can break any block
    if(config.modules.illegalitemsH.enabled === true && block.typeId === "minecraft:piston" || block.typeId === "minecraft:sticky_piston") {
        const piston = block.getComponent("piston");
    
        if(!piston.isRetracted || piston.isMoving || piston.isExpanded) {
            flag(player, "IllegalItems", "H", "Exploit", "isRetracted", `${piston.isRetracted},isRetracting=${piston.isRetracting},isMoving=${piston.isMoving},isExpanding=${piston.isExpanding},isExpanded=${piston.isExpanded}`, false, false, player.selectedSlot);
            block.setType(Minecraft.MinecraftBlockTypes.air);
        }
    }

    if(config.modules.illegalitemsI.enabled === true && config.modules.illegalitemsI.container_blocks.includes(block.typeId) && !player.hasTag("op")) {
        const container = block.getComponent("inventory").container;

        let startNumber = 0;
        let didFindItems = false;
        const emptySlots = container.emptySlotsCount;
        if(container.size > 27) startNumber = container.size / 2;
    
        for(let i = startNumber; i < container.size; i++) {
            const item = container.getItem(i);
            if(typeof item === "undefined") continue;

            // an item exists within the container, get fucked hacker!
            container.setItem(i, new Minecraft.ItemStack(Minecraft.MinecraftItemTypes.dirt, 0, 0));
            didFindItems = true;
        }

        if(didFindItems === true) {
            flag(player, "IllegalItems", "I", "Exploit", "containerBlock", `${block.typeId},totalSlots=${container.size},emptySlots=${emptySlots}`, undefined, undefined, player.selectedSlot);
            block.setType(Minecraft.MinecraftBlockTypes.air);
        }
    }

    if(config.modules.illegalitemsJ.enabled === true && block.typeId.includes("sign") && !player.hasTag("op")) {
        // we need to wait 1 tick before we can get the sign text
        Minecraft.system.run(() => {
            const text = block.getComponent("sign").text;

            if(text.length >= config.modules.illegalitemsJ.max_sign_characters) {
                flag(player, "IllegalItems", "J", "Exploit", "signText", text, undefined, undefined, player.selectedSlot);
                block.setType(Minecraft.MinecraftBlockTypes.air);
            }
        });
    }
});

World.events.blockBreak.subscribe((blockBreak) => {
    const player = blockBreak.player;
    const dimension = blockBreak.dimension;
    const block = blockBreak.block;

    if(config.debug === true) console.warn(`${player.nameTag} has broken the block ${blockBreak.brokenBlockPermutation.type.id}`);

    // nuker/a = checks if a player breaks more than 3 blocks in a tick
    if(config.modules.nukerA.enabled) {
        player.blocksBroken++;

        if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
            flag(player, "Nuker", "A", "Misc", "blocksBroken", player.blocksBroken);

            // killing all the items it drops
            const droppedItems = dimension.getEntities({
                location: block.location,
                minDistance: 0,
                maxDistance: 2,
                type: "item"
            });

            for (const item of droppedItems) item.kill();

            block.setPermutation(blockBreak.brokenBlockPermutation);
        }
    }

    // liquidinteract/a = checks if a player breaks a liquid source block
    if(config.modules.liquidinteractA.enabled) {
        if(config.modules.liquidinteractA.liquids.includes(blockBreak.brokenBlockPermutation.type.id)) {
            flag(player, "LiquidInteract", "A", "Misc", "block", blockBreak.brokenBlockPermutation.type.id);
            block.setPermutation(blockBreak.brokenBlockPermutation);
        }
    }

    // Autotool/A = checks for player slot mismatch
    // This was a nightmare to debug...
    if(config.modules.autotoolA.enabled) {
        // console.warn("block break ", Date.now() - player.startBreakTime);
        if(player.flagAutotoolA === true) {
            flag(player, "AutoTool", "A", "Misc", "selectedSlot", `${player.selectedSlot},lastSelectedSlot=${player.lastSelectedSlot}`);
        }
    }
});

World.events.beforeItemUseOn.subscribe((beforeItemUseOn) => {
    const player = beforeItemUseOn.source;
    const item = beforeItemUseOn.item;

    // commandblockexploit/f = cancels the placement of cbe items
    if(config.modules.commandblockexploitF.enabled && config.itemLists.cbe_items.includes(item.typeId)) {
        flag(player, "CommandBlockExploit","F", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
        beforeItemUseOn.cancel = true;
    }

    /*
        illegalitems/e = cancels the placement of illegal items
        illegalitems/a could be bypassed by using a right click autoclicker/autobuild or lag
        thx drib or matrix_code for telling me lol
    */
    if(config.modules.illegalitemsE.enabled) {
        // items that are obtainble using commands
        if(player.hasTag("op") === false) {
            if(config.itemLists.items_semi_illegal.includes(item.typeId)) {
                // dont affect gmc players
                try {
                    player.runCommand("testfor @s[m=!c]");
                    flag(player, "IllegalItems", "E", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
                    beforeItemUseOn.cancel = true;
                } catch {}
            }

            // patch element blocks
            if(config.itemLists.elements && item.typeId.startsWith("minecraft:element_")) {
                // dont affect gmc players
                try {
                    player.runCommand("testfor @s[m=!c]");
                    flag(player.source, "IllegalItems", "E", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
                    beforeItemUseOn.cancel = true;
                } catch {}
            }
            
            // patch spawn eggs
            if(config.itemLists.spawnEggs && item.typeId.endsWith("_spawn_egg")) {
                // dont affect gmc players
                try {
                    player.runCommand("testfor @s[m=!c]");
                    flag(player, "IllegalItems", "E", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
                    beforeItemUseOn.cancel = true;
                } catch {}
            }
        }
    
        // items that cannot be obtained normally
        if(config.itemLists.items_very_illegal.includes(item.typeId)) {
            flag(player, "IllegalItems", "E", "Exploit", "item", item.typeId, undefined, undefined, player.selectedSlot);
            beforeItemUseOn.cancel = true;
        }
    
    }


});

World.events.playerJoin.subscribe((playerJoin) => {
    const player = playerJoin.player;

    // declare all needed variables in player
    if(config.modules.badpackets5.enabled) player.badpackets5Ticks = 0;
    if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
    if(config.modules.fastuseA.enabled) player.lastThrow = Date.now();
    if(config.modules.autoclickerA.enabled) player.cps = 0;
    if(config.customcommands.report.enabled) player.reports = [];

    // fix a disabler method
    player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "");

    if(data.loaded === false) {
        player.runCommandAsync("scoreboard players set scythe:config gametestapi 1");
        data.loaded = true;
    }

    // remove tags
    player.removeTag("attack");
    player.removeTag("hasGUIopen");
    player.removeTag("right");
    player.removeTag("left");
    player.removeTag("ground");
    player.removeTag("gliding");
    player.removeTag("sprinting");
    player.removeTag("moving");
    player.removeTag("sleeping");

    // load custom nametag
    let foundName;

    player.getTags().forEach(t => {
        // Namespoof/C
        // adding a double qoute makes it so commands cant remove the tag, and cant add the tag to other people
        if(config.modules.namespoofC.enabled && t.startsWith("\"name:\n")) foundName = t.replace("\"name:\n", "");

        // load custom nametag
        t = t.replace(/"|\\/g, "");
        if(t.startsWith("tag:"))
            player.nameTag = `§8[§r${t.slice(4)}§8]§r ${player.name}`;
    });

    if(config.modules.namespoofC.enabled) {
        if(typeof foundName === "undefined") {
            player.addTag(`"name:\n${player.name}`);
        } else if(foundName !== player.name) {
            player.flagNamespoofC = true;
            player.oldName = foundName;
        }
    }

    // Namespoof/A = username length check.
    if(config.modules.namespoofA.enabled) {
        // checks if 2 players are logged in with the same name
        // minecraft adds a sufix to the end of the name which we detect
        if(player.name?.endsWith(')') && (player.name?.length > config.modules.namespoofA.maxNameLength + 3 || player.name?.length < config.modules.namespoofA.minNameLength))
            player.flagNamespoofA = true;

        if(!player.name?.endsWith(')') && (player.name?.length < config.modules.namespoofA.minNameLength || player.name?.length > config.modules.namespoofA.maxNameLength))
            player.flagNamespoofA = true;

        if(player.flagNamespoofA) {
            const extraLength = player.name.length - config.modules.namespoofA.maxNameLength;
            player.nameTag = player.name.slice(0, -extraLength) + "...";
        }
    }

    // Namespoof/B = regex check
    if(config.modules.namespoofB.enabled && config.modules.namespoofB.regex.test(player.name)) player.flagNamespoofB = true;

    // check if the player is in the global ban list
    if(banList.includes(player.name.toLowerCase()) || banList.includes(player.oldName?.toLowerCase())) player.isGlobalBanned = true;
});

World.events.entityCreate.subscribe((entityCreate) => {
    const entity = entityCreate.entity;

    if(config.modules.itemSpawnRateLimit.enabled) {
        data.entitiesSpawnedInLastTick++;

        if(data.entitiesSpawnedInLastTick > config.modules.itemSpawnRateLimit.entitiesBeforeRateLimit) {
            if(config.debug === true) console.warn(`Killed "${entity.typeId}" due to item spawn ratelimit reached.`);
            entity.kill();
        }
    }
    if(config.modules.commandblockexploitG.enabled) {
        if(config.modules.commandblockexploitG.entities.includes(entity.typeId.toLowerCase())) {
            flag(getClosestPlayer(entity), "CommandBlockExploit", "G", "Exploit", "entity", entity.typeId);
            entity.kill();
        }

        if(config.modules.commandblockexploitG.npc && entity.typeId === "minecraft:npc") {
            try {
                entity.runCommand("scoreboard players operation @s npc = scythe:config npc");
                entity.runCommand("testfor @s[scores={npc=1..}]");
                flag(getClosestPlayer(entity), "CommandBlockExploit", "G", "Exploit", "entity", entity.typeId);
                entity.kill();
            } catch {}
        }
    }

    if(entity.typeId === "minecraft:item") {
        const item = entity.getComponent("item").itemStack;

        // Although the crash method this detects has been patched with mineraft version 1.19.40, we
        // can keep it here just to screw other people who dont know it got patched
        if(config.modules.crasherB.enabled === true) {
            if(item.typeId === "minecraft:arrow" && item.data > 43) {
                flag(getClosestPlayer(entity), "Crasher", "B", "Exploit", "item", `${item.typeId},data=${item.data}`);
                entity.kill();
            }
        }
        if(config.modules.illegalitemsB.enabled === true) {
            if(config.itemLists.items_very_illegal.includes(item.id) || config.itemLists.items_semi_illegal.includes(item.id))
                entity.kill();
        }

        if(config.modules.illegalitemsB.enabled === true && config.itemLists.cbe_items.includes(item.id))
            entity.kill();
    }

    // IllegalItems/K = checks if a player places a chest boat with items already inside it
    if(config.modules.illegalitemsK.enabled === true && entity.typeId === "minecraft:chest_boat" && !entity.hasTag("didCheck")) {
        entity.addTag("didCheck");
        Minecraft.system.run(() => {
            const player = getClosestPlayer(entity);
            if(config.modules.illegalitemsK.exclude_scythe_op === true && player.hasTag("op")) return;

            const container = entity.getComponent("inventory").container;

            if(container.size !== container.emptySlotsCount) {
                for(let i = 0; i < container.size; i++) {
                    container.setItem(i, new Minecraft.ItemStack(Minecraft.MinecraftItemTypes.dirt, 0, 0));
                }

                flag(player, "IllegalItems", "K", "Exploit", "totalSlots", `${container.size},emptySlots=${container.emptySlotsCount}`, undefined, undefined, player.selectedSlot);
                entity.kill();
            }
        });
    }
});

World.events.entityHit.subscribe((entityHit) => {
    const entity = entityHit.hitEntity;
    const block = entityHit.hitBlock;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return;

    if(typeof entity === "object") {
        // killaura/C = checks for multi-aura
        if(config.modules.killauraC.enabled) {
            if(!player.entitiesHit.includes(entity.id)) {
                player.entitiesHit.push(entity.id);
                if(player.entitiesHit.length >= config.modules.killauraC.entities) {
                    flag(player, "KillAura", "C", "Combat", "entitiesHit", player.entitiesHit.length);
                }
            }
        }

        // reach/A = check if a player hits an entity more then 5.1 block away
        if(config.modules.reachA.enabled) {
            // get the difference between 2 three dimensional coordinates
            const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
            if(config.debug === true) console.warn(`${player.name} attacked ${entity.nameTag || entity.typeId} with a distance of ${distance}`);

            if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId)) {
                // we ignore gmc players as they get increased reach
                try {
                    player.runCommand("testfor @s[m=!c]");
                    flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`);
                } catch {}
            }
        }

        if(config.modules.reachB.enabled) {
            // get the difference between 2 three dimensional coordinates
            const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
            if(config.debug === true) console.warn(`${player.name} attacked ${entityHitName} with a distance of ${distance}`);

            if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && player.hasTag("reported")) {
                // we ignore gmc players as they get increased reach
                try {
                    player.runCommand("testfor @s[m=!c]");
                    flag(player, "Reach", "B", "Combat", "entity", `${entity.typeId},distance=${distance}`);
                } catch {}
            }
        }

        // badpackets[3] = checks if a player attacks themselves
        // some (bad) hacks use this to bypass anti-movement cheat checks
        if(config.modules.badpackets3.enabled && entity === player) flag(player, "BadPackets", "3", "Exploit");
    
        // check if the player was hit with the UI item, and if so open the UI for that player
        const container = player.getComponent("inventory").container;

        const item = container.getItem(player.selectedSlot);
        if(config.customcommands.gui.enabled && entity.typeId === "minecraft:player" && item?.typeId === "minecraft:wooden_axe" && player.hasTag("op") && item?.nameTag === config.customcommands.gui.gui_item_name) {
            playerSettingsMenuSelected(player, entity);
        }

        // autoclicker/a = check for high cps
        if(config.modules.autoclickerA.enabled || !data.checkedModules.autoclicker) {
            // if anti-autoclicker is disabled in game then disable it in config.js
            if(data.checkedModules.autoclicker === false) {
                if(getScore(player, "autoclicker", 1) >= 1) {
                    config.modules.autoclickerA.enabled = false;
                }
                data.checkedModules.autoclicker = true;
            }

            player.cps++;
        }
        
        // Check if the player attacks an entity while sleeping
        if(config.modules.killauraD.enabled === true && player.hasTag("sleeping")) {
            flag(player, "Killaura", "D", "Combat");
        }
    }

    if(typeof block === "object") {
        if(config.modules.autotoolA.enabled) {
            // console.warn("hit block", Date.now() - player.startBreakTime);
            player.flagAutotoolA = false;
            player.lastSelectedSlot = player.selectedSlot;
            player.startBreakTime = Date.now();
        }
    }

    if(config.debug === true) console.warn(player.getTags());
});

World.events.beforeItemUse.subscribe((beforeItemUse) => {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;

    // GUI stuff
    if(config.customcommands.gui.enabled && item.typeId === "minecraft:wooden_axe" && item.nameTag === config.customcommands.gui.gui_item_name && player.hasTag("op")) {
        mainGui(player);
        beforeItemUse.cancel = true;
    }
    // Fastuse/A = Checks for horion fast throw
    if(config.modules.fastuseA.enabled === true) {
        const lastThrowTime = Date.now() - player.lastThrow;
        if(lastThrowTime < 184) console.warn("detected fastthrow4", lastThrowTime);
        if(lastThrowTime < config.modules.fastuseA.use_delay) {
            flag(player, "FastUse", "A", "Combat", "lastThrowTime", lastThrowTime);
            beforeItemUse.cancel = true;
        }
        player.lastThrow = Date.now();
    }
    // patch a bypass for the freeze system
    if(item.typeId === "minecraft:milk_bucket" && player.hasTag("freeze"))
        beforeItemUse.cancel = true;

    if(config.modules.badenchantsA.enabled || config.modules.badenchantsB.enabled || config.modules.badenchantsC.enabled) {
        const itemEnchants = item.getComponent("enchantments").enchantments;
        let itemType = Minecraft.ItemTypes.get(item.typeId);
        if(typeof itemType === "undefined") itemType = Minecraft.ItemTypes.get("minecraft:book");

        const item2 = new Minecraft.ItemStack(itemType, 1, item.data);
        const item2Enchants = item2.getComponent("enchantments").enchantments;

        for (const enchantment in Minecraft.MinecraftEnchantmentTypes) {
            const enchantData = itemEnchants.getEnchantment(Minecraft.MinecraftEnchantmentTypes[enchantment]);

            if(typeof enchantData === "object") {
                if(config.modules.badenchantsA.enabled === true) {
                    const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];
                    if(typeof maxLevel === "number") {
                        if(enchantData.level > maxLevel) flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, beforeItemUse, player.selectedSlot);
                    } else if(enchantData.level > Minecraft.MinecraftEnchantmentTypes[enchantment].maxLevel)
                        flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, beforeItemUse, player.selectedSlot);
                }

                if(config.modules.badenchantsB.enabled && enchantData.level <= 0)
                    flag(player, "BadEnchants", "B", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, beforeItemUse, player.selectedSlot);

                if(config.modules.badenchantsC.enabled) {
                    if(!item2.getComponent("enchantments").enchantments.canAddEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantment], 1))) {
                        flag(player, "BadEnchants", "C", "Exploit", "item", `${item.typeId},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, beforeItemUse, player.selectedSlot);
                    }

                    if(config.modules.badenchantsB.multi_protection === true) {
                        item2Enchants.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantData.type.id], 1));
                        item2.getComponent("enchantments").enchantments = item2Enchants;
                    }
                }
            }
        }
    }
});

Minecraft.system.events.beforeWatchdogTerminate.subscribe((beforeWatchdogTerminate) => {
    // We try to stop any watchdog crashes incase malicous users try to make the scripts lag
    // and causing the server to crash
    beforeWatchdogTerminate.cancel = true;

    console.warn(`${new Date()} | A Watchdog Exception has been detected and has been cancelled successfully. Reason: ${beforeWatchdogTerminate.terminateReason}`);
});

checkPlayer();

// when using /reload, the variables defined in playerJoin dont persist
if([...World.getPlayers()].length >= 1) {
    for(const player of World.getPlayers()) {
        if(config.modules.badpackets5.enabled) player.badpackets5Ticks = 0;
        if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
        if(config.modules.fastuseA.enabled) player.lastThrow = Date.now();
        if(config.modules.autoclickerA.enabled) player.cps = 0;
        if(config.customcommands.report.enabled) player.reports = [];
    }
}
