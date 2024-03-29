import * as Minecraft from "@minecraft/server";
import { flag, banMessage, getClosestPlayer, getScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";

const World = Minecraft.world;

if(config.debug === true) console.warn(`${new Date()} | Im not a t-w-a-t and this actually worked :sunglasses:`);

World.events.beforeChat.subscribe(msg => {
    const message = msg.message.toLowerCase();
    const player = msg.sender;

    if(config.debug === true && message === "ping") player.tell(`${new Date()} | Pong!`)

    // Stops people talking about hacked clients
    if(message.includes("the best minecraft bedrock utility mod") || message.includes("disepi/ambrosial") || message.includes("horion") || message.includes("zephyr") || message.includes("packet")) {
        msg.cancel = true;
        player.tell("§6[§cPulse-Anti-Spam§6]§c§l Please do not talk about clients in our chat!");

    }
     
    if(player.hasTag("isMuted")) {
        msg.cancel = true;
        if(config.appeal === "No Appeal") {
            player.tell(`§r§6[§cPulse§6]§r §1§lNOPE! §r§cYou are muted!`);
        } else {
            player.tell(`§r§6[§cPulse§6]§r §1§lNOPE! §r§cYou are muted! You can appeal this mute at ${config.appeal}`);
        }

    }

    // BadPackets/2 = checks for invalid chat message lengths
    if(config.modules.badpackets2.enabled === true && message.length > config.modules.badpackets2.maxlength || message.length < config.modules.badpackets2.minLength) flag(player, "BadPackets", "2", "Exploit", false, false, false);

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
    Minecraft.system.run(() => {
        if(config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;
    
        // run as each player
        for (const player of World.getPlayers()) {
            try {
    
            if(player.isGlobalBanned === true) {
                player.addTag("by:Pulse Anticheat");
                player.addTag("reason:You are Pulse Anticheat global banned!");
                player.addTag("isBanned");
            }
    
            // sexy looking ban message
            if(player.hasTag("isBanned")) banMessage(player);
    
            if(player.blocksBroken !== 0 && config.modules.nukerA.enabled === true) player.blocksBroken = 0;
            if(player.entitiesHit !== [] && config.modules.killauraC.enabled === true) player.entitiesHit = [];
            if(Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay && player.lastSelectedSlot !== player.selectedSlot) {
                player.flagAutotoolA = true;
                player.autotoolSwitchDelay = Date.now() - player.startBreakTime;
            }
    
            // BadPackets[5] = checks for horion freecam
            if(config.modules.badpackets5.enabled && player.velocity.y.toFixed(6) === "0.420000" && !player.hasTag("dead") && !player.hasTag("sleeping")) {
                player.badpackets5Ticks++;
                if(player.badpackets5Ticks > config.modules.badpackets5.sample_size) flag(player, "BadPackets", "5", "Exploit", "yVelocity", player.velocity.y.toFixed(6), true);
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

        // NoSlow/A = speed limit check
        if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed) {
            if(!player.getEffect(Minecraft.MinecraftEffectTypes.speed) && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right", 0) >= 5) {
                flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
                beforeItemUse.cancel = true;
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
            if(config.modules.illegalitemsD.enabled === true) {
                if(config.itemLists.items_very_illegal.includes(item.typeId)) flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);

                // semi illegal items
                if(!player.hasTag("op")) {
                    let flagPlayer = false;
                    // patch element blocks
                    if(config.itemLists.elements && item.typeId.startsWith("minecraft:element_"))
                        flagPlayer = true;

                    // patch spawn eggs
                    if(config.itemLists.spawnEggs && item.typeId.endsWith("_spawn_egg"))
                        flagPlayer = true;

                    if(config.itemLists.items_semi_illegal.includes(item.typeId) || flagPlayer === true) {
                        const checkGmc = World.getPlayers({
                            excludeGameModes: [Minecraft.GameMode.creative],
                            name: player.name
                        });

                        if([...checkGmc].length !== 0) {
                            flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, player.selectedSlot);
                        }
                    }
                }
            }
            // CommandBlockExploit/H = clear items
            if(config.modules.commandblockexploitH.enabled && config.itemLists.cbe_items.includes(item.typeId))
                flag(player, "CommandBlockExploit", "H", "Exploit", "item", item.typeId, undefined, undefined, i);
                
            // Illegalitems/F = Checks if an item has a name longer then 32 characters
            if(config.modules.illegalitemsF.enabled && item.nameTag?.length > config.modules.illegalitemsF.length)
                flag(player, "IllegalItems", "F", "Exploit", "name", `${item.nameTag},length=${item.nameTag.length}`, undefined, undefined, i);

            // BadEnchants/D = checks if an item has a lore
            if(config.modules.badenchantsD.enabled && item.getLore().length) {
                if(!config.modules.badenchantsD.exclusions.includes(String(item.getLore())))
                    flag(player, "BadEnchants", "D", "Exploit", "lore", String(item.getLore()), undefined, undefined, i);
            }

            // Anti-Shulker/A = Checks for shulkers
            if(config.modules.antishulkerA.enabled && config.itemLists.antiBypassItems.includes(item.typeId) && config.modules.antishulkerA.antiBypass === true || config.modules.antishulkerA.normalShulkers.includes(item.typeId)) {
                flag(player, "Antishulker", "A", "Exploit", "item", item.typeId, undefined, undefined, i);
                player.runCommandAsync(`clear ${player} ${item.typeId}`);
            }

            if(config.modules.resetItemData.enabled === true && config.modules.resetItemData.items.includes(item.typeId)) {
                // This creates a duplicate version of the item, with just its amount and data.
                const item2 = new Minecraft.ItemStack(Minecraft.Items.get(item.typeId), item.amount, item.data);
                container.setItem(i, item2);
            }

            if(config.modules.badenchantsA.enabled || config.modules.badenchantsB.enabled || config.modules.badenchantsC.enabled) {
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
                const enchantments = [];
                
                const loopIterator = (iterator) => {
                    const iteratorResult = iterator.next();
                    if(iteratorResult.done === true) return;
                    const enchantData = iteratorResult.value;

                    // badenchants/A = checks for items with invalid enchantment levels
                    if(config.modules.badenchantsA.enabled === true) {
                        const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];
                        if(typeof maxLevel === "number") {
                            if(enchantData.level > maxLevel) flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                        } else if(enchantData.level > enchantData.type.maxLevel)
                            flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                    }

                    // badenchants/B = checks for negative enchantment levels
                    if(config.modules.badenchantsB.enabled && enchantData.level <= 0)
                        flag(player, "BadEnchants", "B", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);

                    // badenchants/C = checks if an item has an enchantment which isnt support by the item
                    if(config.modules.badenchantsC.enabled) {
                        if(!item2.getComponent("enchantments").enchantments.canAddEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantData.type.id], 1))) {
                            flag(player, "BadEnchants", "C", "Exploit", "item", `${item.typeId},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                        }

                        if(config.modules.badenchantsB.multi_protection === true) {
                            item2Enchants.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantData.type.id], 1));
                            item2.getComponent("enchantments").enchantments = item2Enchants;
                        }
                    }

                    // BadEnchants/E = checks if an item has duplicated enchantments
                    if(config.modules.badenchantsE.enabled === true) {
                        if(enchantments.includes(enchantData.type.id)) {
                            enchantments.push(enchantData.type.id);
                            flag(player, "BadEnchants", "E", "Exploit", "enchantments", enchantments.join(", "), false, undefined , i);
                        }
                        enchantments.push(enchantData.type.id);
                    }

                    loopIterator(iterator);
                };
                loopIterator(itemEnchants[Symbol.iterator]());
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

        // If a player wants to they can see someones velocity
        if(player.hasTag("seeVelocity") && !player.velocity.x === 0 && !player.velocity.z === 0) {
            player.tell(`X=${player.velocity.x}, Y=${player.velocity.y}, Z=${player.velocity.z}`);
        }

        // BadPackets[6] = Checks for moving with no velocity
        if(config.modules.badpackets6.enabled) {
            if(config.modules.enabled && player.velocity.x === 0 && player.velocity.z === 0 && player.velocity.y === 0 && player.hasTag("moving")) {
                flag(player, "BadPackets", "6", "Movement", undefined, undefined, true);
                player.runCommand("tp @s @s");
            }
        }
        
        // BadPackets[7] = Checks for having velocity but not moving
        if(config.modules.badpackets7.enabled) {
            if(player.velocity.x > config.modules.badpackets7.minVelocity && player.velocity.y > config.modules.badpackets7.minVelocity && player.velocity.z > config.modules.badpackets7.minVelocity && !player.hasTag("moving")) {
                flag(player, "BadPackets", "7", "Movement", undefined, undefined, true);
                player.runCommand("tp @s @s");
            }
        }
        // Movement/a = checks for unaturall movement
        if(config.modules.movementA.enabled && Math.abs(player.velocity.y).toFixed(4) === "0.1552" && !player.hasTag("attacked") && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
            const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);

            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");

            if(isNotInAir === false) flag(player, "Movement", "A", "Movement", "vertical_speed", Math.abs(player.velocity.y).toFixed(4), true);
        }

        // Movement/C = Checks for the weird TP like speed movement
        if(config.modules.movementC.enabled && !player.hasTag("flying") && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("attacked") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
            let Xposition1 = new Minecraft.BlockLocation(player.location.x);
            let Zposition1 = new Minecraft.BlockLocation(player.location.z);
            Minecraft.system.run(() => {
                let Xposition2 = new Minecraft.BlockLocation(player.location.x);
                let Zposition2 = new Minecraft.BlockLocation(player.location.z);
                const Xdistance = Math.sqrt(Math.abs(Xposition1 - Xposition2));
                const Zdistance = Math.sqrt(Math.abs(Zposition1 - Zposition2));
                if(Xdistance > config.modules.movementC.minDistance && Xdistance < config.modules.movementC.maxDistance || Zdistance > config.modules.movementC.minDistance && Zdistance < config.modules.movementC.maxDistance)
                    flag(player, "movement", "C", "Movement", undefined, undefined, true);
            }); 
        }



        //Fly/C = A Minecraft Java style fly check (ish)
        if(config.modules.flyC.enabled && !player.hasTag("flying") && !player.hasTag("op") ) {
            const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);
            const velocity1 = Math.abs(player.velocity.x + player.velocity.y + player.velocity.z);
            const velocity2 = Math.abs(velocity1 / 3);
            const velocity3 = Math.abs(velocity1 / 2);
            const velocity4 = Math.abs(velocity2 + velocity3);
            const velocity5 = Math.abs((player.velocity.x + player.velocity.z) / 2);
            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
            if(isNotInAir === false && velocity4 > config.modules.flyC.velocity && velocity5 > config.modules.flyC.hVelocity) {
                flag(player, "Fly", "C", "Movement", "velocity", velocity4, false);
            }

        }


        //Jesus/A = Checks for staying 1 block above water over 2 ticks 
        if(config.modules.jesusA.enabled && !player.hasTag("jump") && !player.hasTag("swimming") && !player.hasTag("flying")) {
            const findaircoords = new Minecraft.BlockLocation(player.location.x, player.location.y, player.location.z);
            const findwatercoords = new Minecraft.BlockLocation(player.location.x, player.location.y - 1, player.location.z);
            const isInAir = findaircoords.blocksBetween(findaircoords).some((block) => player.dimension.getBlock(block).typeId == "minecraft:air");
            const hasWaterBelow = findwatercoords.blocksBetween(findwatercoords).some((block) => player.dimension.getBlock(block).typeId == "minecraft:water");
            if(isInAir === true && hasWaterBelow === true) {
                flag(player, "Jesus", "A", "Movement", undefined, undefined, false);
                player.runCommand("tp @s ~ ~-1 ~");
            }
        }



        
        // Fly/B = Checks for vertical Fly
        if(config.modules.flyB.enabled && !player.hasTag("flying") && !player.hasTag("op")) {
            const pos1 = new Minecraft.BlockLocation(player.location.x, player.location.y + 2, player.location.z);
            const pos2 = new Minecraft.BlockLocation(player.location.x, player.location.y - 2, player.location.z);
            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
            const hVelocity = Math.abs((player.velocity.x + player.velocity.z) / 2);
            if(isNotInAir === false && player.velocity.y > config.modules.flyB.minVelocity && hVelocity < config.modules.flyB.MaxHVelocity && !player.hasTag("op") && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("attacked") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
                flag(player, "Fly", "B", "Movement", "yVelocity", Math.abs(player.velocity.y), false);
            } 
        }


        //Fly/D = Checks for fly like velocity
        if(config.modules.flyD.enabled && !player.hasTag("op") && !player.hasTag("jump") && !player.hasTag("flying")) {
            const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);
            const makeYVelocity1 = Math.abs(player.velocity.x + player.velocity.z)
            const yVelocity = Math.abs(makeYVelocity1 / 2)
            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
            if(player.velocity.y > yVelocity && player.velocity.x > config.modules.flyD.Velocity && isNotInAir === false) {
                flag(player, "Fly", "D", "Movement", "velocity", Math.abs(player.velocity.y).toFixed(4), false);
            }
        }

        // Fly/E = Checks for being in air but not falling
        if(config.modules.flyE.enabled && !player.hasTag("flying") && !player.hasTag("op")) {
            if(player.velocity.y === 0) {
                const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
                const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);
                const findHVelocity = Math.abs((player.velocity.x + player.velocity.z) / 2);
                const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
                if(isNotInAir === false && findHVelocity > config.modules.flyE.hVelocity) {
                    flag(player, "Fly", "E", "Movement", "yVelocity", Math.abs(player.velocity.y).toFixed(4), false);
                }          
            }
        }

        //Fly/F = Checks for being in the air and not falling
        if(config.modules.flyF.enabled) {
            let yPos1 = Minecraft.BlockLocation(player.location.y);
            Minecraft.system.run(() => {
                let yPos2 = Minecraft.BlockLocation(player.location.y);
                if(yPos2 === yPos1) {
                    const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
                    if(isNotInAir === false) {         
                        flag(player, "Fly", "F", "Movement", undefined, undefined, false);     
                    }    
                } 
            }); 
        }

        /*/HighJump/a = Checks for jumping above 'config.modules.highjumpA.jumpHeight'
        if(config.modules.highjumpA.enabled === true) {
            if(!player.hasTag("ground")) {
                Minecraft.system.run(() => {
                    const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
                    const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);
            
                    const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
                    if(isNotInAir === true) {
                        const lastYLocationOnGround = player.location.y;
                    }
                    const distanceFromGroundToJump = player.location.y
                    const distance = Math.sqrt(Math.pow(lastYLocationOnGround - distanceFromGroundToJump))
                    if(distance > config.modules.highjumpA.jumpHeight && player.hasTag("jump")) {
                        flag(player, "Highjump", "A", "Movement", "jumpHeight", `${distance}`, true);
                    }
                });
            }
        }
        */

        // Fly/A = Checks for airwalk cheats
        if(config.modules.flyA.enabled && !player.hasTag("op") && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("attacked") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving") && !player.hasTag("flying")) {
            
            const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
            const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);
            const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");
            if(isNotInAir === false && !player.getEffect(Minecraft.MinecraftEffectTypes.speed)) {
                if(playerSpeed === 0.16 || playerSpeed === 0.17 || playerSpeed === 0.13 || playerSpeed > config.modules.flyA.speed) 
                    flag(player, "Fly", "A", "Movement", "speed", playerSpeed, false);
            }
        }
        
        // Anti-KB/A = checks for the weird way veloctiy works on horion/zephyr client
        // Thanks Visual1Impact / Paradox-Anticheat
        if(config.modules.antikbA.enabled) {
            if(Number((player.velocity.y + player.velocity.x + player.velocity.z).toFixed(3)) <= config.modules.antikbA.magnitude) {
                if(player.hasTag("attacked") && !player.hasTag("dead") && !player.hasTag("gliding") && !player.hasTag("levitating") && !player.hasTag("flying")) {
                    try {
                        player.runCommand("testfor @s[m=!c]")
                        flag(player, "AntiKB", "A", "Combat", undefined, undefined, true);
                    } catch {}
                } 
                    
            }  
        }

        // Speed/A = Checks for unaturall speed
        if(config.modules.speedA.enabled && !player.hasTag("attacked") && !player.hasTag("op") && !player.hasTag("flying")) {
            if(playerSpeed > config.modules.speedA.speed && !player.getEffect(Minecraft.MinecraftEffectTypes.speed) || config.modules.speedA.checkForJump === true && playerSpeed > config.modules.speedA.speed && !player.getEffect(Minecraft.MinecraftEffectTypes.speed) && !player.hasTag("jump") || config.modules.speedA.checkForSprint === true && playerSpeed > config.modules.speedA.speed && !player.getEffect(Minecraft.MinecraftEffectTypes.speed) && !player.hasTag("sprint"))
                flag(player, "Speed", "A", "Movement", "speed", playerSpeed, false);
        }

        // Speed/C = Checks for VHop
        if(config.modules.speedC.enabled && !player.hasTag("jump") && !player.hasTag("flying")) {
            const velocityCheck1 = Math.abs(player.velocity.x + player.velocity.y + player.velocity.z);
            const velocityCheck2 = Math.abs(velocityCheck1 / 2);
            const velocityCheck3 = Math.abs(velocityCheck2 / 3);
            const velocityCheck4 = Math.abs((velocityCheck2 * velocityCheck3) / 2);
            if(velocityCheck4 > config.modules.speedC.velocity) {
                flag(player, "Speed", "C", "Movement", undefined, undefined, false);
            }
        }

        //Speed/B = Checks for BHop or VHop like cheats
        if(config.modules.speedB.enabled === true && !player.hasTag("jump") && !player.hasTag("flying")) {
            const checkForInvalidVelocity = Math.abs(player.velocity.x + player.velocity.y + player.velocity.z);
            const checkForInvalidVelocity2 = Math.abs(checkForInvalidVelocity / (player.velocity.x + player.velocity.z));
            if(config.modules.speedB.velocities.includes(checkForInvalidVelocity2)) {
                if(config.modules.speedB.checkForHighSpeed === true) {
                    if(playerSpeed >= config.modules.speedB.speed) {
                        flag(player, "Speed", "B", "Movement", undefined, undefined, false);
                    } else {
                        flag(player, "Speed", "B", "Movement", undefined, undefined, false);
                    }
                }
            }
        }

        // 
        
        // Autoclicker/A = checks for high CPS
        if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
            player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
            if(player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);
            player.firstAttack = Date.now();
            player.cps = 0;
        }

        // Autoclicker/B = checks for similar cps
        if(config.modules.autoclickerB.enabled) {
            player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
            player.runCommandAsync(`tell @a[tag=seeCPS] ${player}'s CPS=${player.cps}`);
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
            if(player.hasTag("errorlogger")) player.tell(`§r§6[§cPulse§6]§r There was an error while running the tick event.`);
        }
    }
    checkPlayer();
});
}

World.events.blockPlace.subscribe((blockPlace) => {
    const block = blockPlace.block;
    const player = blockPlace.player;
    
    
    if(config.debug === true) console.warn(`${player.nameTag} has placed ${block.typeId}.`);

    //scaffold/A = checks for placing more than 1 block in a tick
    if(config.modules.scaffoldA.enabled) {
        //makes blocksPlaced
        player.blocksPlaced++;

        if(blocksPlaced.player > 1)
            flag(player, "Scaffold", "A", "Placement", "blocks-placed", `${blocksPlaced}`, true);
            // Stops block Placement
            blockPlace.cancel = true;
    }

    //Scaffold/B = checks for placing a block and attacking at the same time
    if(config.modules.scaffoldB.enabled) {
        if(blockPlace.player && player.hasTag("left"))
            flag(player, "Scaffold", "B", "Placement", undefined, undefined, true);
            blockPlace.cancel = true;

    }    
    //Scaffold/C = checks for placing a block and going very fast at the same time
    if(config.modules.scaffoldC.enabled && !player.hasTag("op")) {
        if(playerSpeed >= config.modules.scaffoldC.speed) {
            try{
                player.runCommand("testfor @s[m=!c]");
                flag(player, "Scaffold", "C", "Placement", "speed", playerSpeed, true);
                blockPlace.cancel = true;
            } catch {}
        }
    }

    //Scaffold/D = Checks for invalid slot selection
    if(config.modules.scaffoldD.enabled) {
        if(!blockPlace.Item.includes(item.typeId)) {
            flag(player, "Scaffold", "D", "Placement", undefined, undefined, true);
            blockPlace.cancel = true;
        }
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

    // Recent Scythe Update, Credit to MrDiamond64 / USSR
    if(config.modules.commandblockexploitH.enabled === true && block.typeId === "minecraft:hopper") {
        const pos1 = new Minecraft.BlockLocation(block.location.x + 2, block.location.y + 2, block.location.z + 2);
        const pos2 = new Minecraft.BlockLocation(block.location.x - 2, block.location.y - 2, block.location.z - 2);

        let foundDispenser = false;
        pos1.blocksBetween(pos2).some((block) => {
            const blockType = player.dimension.getBlock(block);
            if(blockType.typeId !== "minecraft:dispenser") return;

            blockType.setType(Minecraft.MinecraftBlockTypes.air);
            foundDispenser = true;
        });

        if(foundDispenser === true)
            player.dimension.getBlock(new Minecraft.BlockLocation(block.location.x, block.location.y, block.location.z))
                .setType(Minecraft.MinecraftBlockTypes.air);
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
                location: new Minecraft.Location(block.location.x, block.location.y, block.location.z),
                minDistance: 0,
                maxDistance: 2,
                type: "item"
            });

            for (const item of droppedItems) item.kill();

            block.setPermutation(blockBreak.brokenBlockPermutation);
        }
    }

    // Instabreak/A = Checks for breaking unbreakable blocks in survival
    if(config.modules.instabreakA.enabled === true) {
        if(config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {
            try {
                player.runCommand("testfor @s[m=!c]");
                flag(player, "InstaBreak", "A", "Exploit", "block", blockBreak.brokenBlockPermutation.type.id);
            } catch {}
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
    /* Anti-Grief/A = stops the use of flint and steel
    if(config.modules.antigriefA.enabled) { 
        if(config.modules.antigriefA.item.includes(item.typeId)) {
            flag(player, "AntiGrief", "A", "Misc", "item", item.typeId, false);
            beforeItemUseOn.cancel = true;
            player.runCommand(`clear @s ${item.typeId}` );
        }
    }
    */
    // Anti-Grief/B = stops people using explosives of any kind
    if(config.modules.antigriefB.enabled) {
        if(config.itemLists.antiGriefItems.includes(item.typeId) && !config.modules.antigriefB.exculsions.includes(item.typeId)) {
            flag(player, "AntiGrief", "B", "Misc", "item", item.typeId, false);
            beforeItemUseOn.cancel = true;
            player.runCommand(`clear @s ${item.typeId}` );
        }
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
    if(config.modules.nukerA.enabled) player.blocksBroken = 0;
    if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
    if(config.modules.fastuseA.enabled) player.lastThrow = Date.now();
    if(config.modules.autoclickerA.enabled) player.cps = 0;
    //if(config.modules.reachA.enabled || config.modules.movementC.enabled || config.modules.highjumpA.enabled) distance = 0;
    if(config.customcommands.report.enabled) player.reports = [];
    if(config.modules.killauraC.enabled) player.entitiesHit = [];

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
    if(config.modules.illegalitemsK.enabled === true && config.modules.illegalitemsK.entities.includes(entity.typeId) && !entity.hasTag("didCheck")) {
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
            if(!player.entitiesHit.includes(entity.typeId)) {
                player.entitiesHit.push(entity.typeId);
                if(player.entitiesHit.length >= config.modules.killauraC.entities) {
                    flag(player, "KillAura", "C", "Combat", "entitiesHit", player.entitiesHit.length);
                }
            }
        }



        // reach/A = check if a player hits an entity more than (config.modules.reachA.reach) block away
        if(config.modules.reachA.enabled === true) {
            // get the difference between 2 three dimensional coordinates
            const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
            //if(config.debug === true) console.warn(`${player.name} attacked ${entity.nameTag || entity.typeId} with a distance of ${distance}`);

            if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId)) {
                const checkGmc = World.getPlayers({
                    excludeGameModes: [Minecraft.GameMode.creative],
                    name: player.name
                });
            
                if([...checkGmc].length !== 0)
                    flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`);
            }
        }

        if(config.modules.reachA.enabled === true && player.hasTag("reported")) {
            // get the difference between 2 three dimensional coordinates
            const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
            //if(config.debug === true) console.warn(`${player.name} attacked ${entity.nameTag || entity.typeId} with a distance of ${distance}`);

            if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId)) {
                const checkGmc = World.getPlayers({
                    excludeGameModes: [Minecraft.GameMode.creative],
                    name: player.name
                });
            
                if([...checkGmc].length !== 0)
                    flag(player, "Reach", "B", "Combat", "entity", `${entity.typeId},distance=${distance}`);
            }
        }

        // badpackets[3] = checks if a player attacks themselves
        // some (bad) hacks use this to bypass anti-movement cheat checks
        if(config.modules.badpackets3.enabled && entity.id === player.id) flag(player, "BadPackets", "3", "Exploit");
    
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

        // Killaura/E = Checks for htiting invalid entities
        if(config.modules.killauraE.enabled) {
            if("minecraft:xp_orb".includes(entity.typeId) || "minecraft:arrow".includes(entity.typeId) || "minecraft:xp_bottle".includes(entity.typeId)) {
                flag(player, "Killaura", "E", "Combat", "invalidEntity", entity.typeId, false);
            }
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
        console.warn(lastThrowTime);
        if(lastThrowTime > config.modules.fastuseA.min_use_delay && lastThrowTime < config.modules.fastuseA.use_delay) {
            flag(player, "FastUse", "A", "Combat", "lastThrowTime", lastThrowTime);
            beforeItemUse.cancel = true;
        }
        player.lastThrow = Date.now();
    }

    /* Fastuse/B = Checks for eating fast
    if(config.modules.fastuseB.enabled) {
        if(config.modules.fastuseB.items.includes(item.typeId)) {
            const startTime = Date.now()
            if(player.hasTag("left")) {
                const endTime = Date.now()
                const overallTime = startTime - endTime
                if(overallTime < config.modules.fastuseB.min_eat_delay) {
                    flag(player, "Fastuse", "B", "Misc", `EatTime=${overallTime}`, false, false)
                }
            }
        }
    }
    */
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
        if(config.modules.nukerA.enabled) player.blocksBroken = 0;
        if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
        if(config.modules.fastuseA.enabled) player.lastThrow = Date.now() - 200;
        if(config.modules.autoclickerA.enabled) player.cps = 0;
        //if(config.modules.reachA.enabled || config.modules.movementC.enabled || config.modules.highjumpA.enabled) distance = 0;
        if(config.modules.killauraC.enabled) player.entitiesHit = [];
        if(config.customcommands.report.enabled) player.reports = [];
    }
}
