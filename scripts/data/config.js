export default
{
    "debug": true,
    "flagWhitelist": [],
    "appeal": "No Appeal",
    "customcommands": {
        "prefix": "!",
        "ban": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "help": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "op": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["staff"]
        },
        "credits": {
            "enabled": true,
            "requiredTags": []
        },
        "allowgma": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["antigma"]
        },
        "allowgmc": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["antigmc"]
        },
        "allowgms": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["antigms"]
        },
        "bedrockvalidate": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["bv"]
        },
        "modules": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "npc": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "overridecommandblocksenabled": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["overidecbe","overidecommandblocksenabled"]
        },
        "removecommandblocks": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["removecb"]
        },
        "worldborder": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["wb"]
        },
        "xray": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "autoclicker": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ac"]
        },
        "autoban": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ab"]
        },
        "invalidsprint": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["is"]
        },
        "ecwipe": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["enderchestwipe", "ecw"]
        },
        "freeze": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "stats": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "fullreport": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["fr"]
        },
        "kick": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "mute": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "unmute": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["un"]
        },
        "fly": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "invsee": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["inv"]
        },
        "notify": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "tag": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["rank"]
        },
        "vanish": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["v"]
        },
        "report": {
            "enabled": true,
            "requiredTags": []
        },
        "unban": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "gui": {
            "enabled": true,
            "gui_item_name": "§r§l§cRight click to Open the UI",
            "requiredTags": ["op"],
            "aliases": ["ui"]
        },
        "resetwarns": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["rw"]
        },
        "version": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "antishulker": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "testaura": {
            "enabled": true,
            "requiredTags": ["modstatus"]
        },
        "checkinfo": {
            "enabled": true,
            "requiredTags": ["modstatus"]
        },
        "spawn": {
            "enabled": true,
            "requiredTags": []
        }
    },
    "modules": {
        "itemSpawnRateLimit": {
            "enabled": false,
            "entitiesBeforeRateLimit": 10
        },
        "filterUnicodeChat": false,
        
        "badpackets2": {
            "enabled": true,
            "minLength": 1,
            "maxlength": 512,
            "punishment": "ban",
            /*
            PunishmentLength can be either a length ('7d', '2w 1h'), how long the ban should be in milliseconds
            or to just perm ban the user (set value to nothing)
            */
            "punishmentLength": "5m",
            "minVlbeforePunishment": 1
        },
        "spammerA": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerB": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerC": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerD": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerE": {
            "enabled": true,
            "punsihemnt": "mute",
            "minVlbeforePunishment": 5
        },
        "crasherA": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        "namespoofA": {
            "enabled": true,
            "minNameLength": 3,
            "maxNameLength": 16,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "namespoofB": {
            "enabled": true,
            "regex": /[^A-Za-z0-9_\-() ]/,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "bedrockValidate": {
            "enabled": true,
            "overworld": true,
            "nether": true
        },
        "reachA": {
            "enabled": true,
            "reach": 5.9,
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "ban",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 15
        },
        "reachB": {
            "enabled": true,
            "reach": 5.1,
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "ban",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
        },        
        "noslowA": {
            "enabled": true,
            "speed": 0.12,
            "maxSpeed": 0.16,
            "punishment": "ban",
            "punishmentLength": "21d",
            "minVlbeforePunishment": 15
        },
        "illegalitemsB": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsC": {
            "enabled": true,
            "maxStack": 64,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "invalidsprintA": {
            "enabled": true,
            "punishment": "ban",
            "minVlbeforePunishment": 1
        },
        "illegalitemsD": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "commandblockexploitF": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        "nukerA": {
            "enabled": true,
            "maxBlocks": 3,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "liquidinteractA": {
            "enabled": true,
            "liquids": [
                "minecraft:water",
                "minecraft:flowing_water",
                "minecraft:lava",
                "minecraft:flowing_lava"
            ],
            "punishment": "ban",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 1
        },
        "movementA": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 15
        },
        "illegalitemsE": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        "commandblockexploitG": {
            "enabled": true,
            "npc": true,
            "entities": [
                "minecraft:command_block_minecart"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badenchantsA": {
            "enabled": true,
            "levelExclusions": {
                /*
                If your realm uses enchantments with levels higher then vanilla then you need to exclude them here.
                To add an exclusion, add ' "<enchantment name>": <max level> ' below the examples
                Anything in this area will be considered as a comment, and wont take affect

                "efficiency": 69,
                "sharpness": 420
                */
            },
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badenchantsB": {
            "enabled": true,
            "multi_protection": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badenchantsC": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badenchantsD": {
            "enabled": true,
            "exclusions": [
                "(+DATA)"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "killauraC": {
            "enabled": true,
            "entities": 3,
            "punishment": "ban",
            "punishmentLength": "7d",
            "alsoKick": true,
            "minVlbeforePunishment": 2
        },
        "illegalitemsF": {
            "enabled": true,
            "length": 32,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badpackets3": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "1w",
            "minVlbeforePunishment": 1
        },
        "autoclickerA": {
            "enabled": true,
            "maxCPS": 12,
            "checkCPSAfter": 1000,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "commandblockexploitH": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badpackets4": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "crasherB": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badpackets5": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "namespoofC": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "illegalitemsH": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "autotoolA": {
            "enabled": true,
            "startBreakDelay": 85,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsI": {
            "enabled": true,
            "exclude_scythe_op": true,
            "container_blocks": [
                "minecraft:chest",
                "minecraft:trapped_chest"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "killauraD": {
            "enabled": true,
            "punishment": "none",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 1
        },
        "illegalitemsJ": {
            "enabled": true,
            "max_sign_characters": 1,
            "exclude_scythe_op": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsK": {
            "enabled": true,
            "exclude_scythe_op": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "movementB": {
            "enabled": false,
            "punishment": "ban",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 15
        },
        "strafeB": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0 
        },
        "banA": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "3d",
            "minVlbeforePunishment": 5,
        },
        "scaffoldB": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
        },
        "scaffoldA": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
        },
        "scaffoldC": {
            "enabled": true,
            "punishment": "kick",
            "speed": 0.11,
            "minVlbeforePunishment": 5
        },
        "scaffoldD": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "scaffoldE": {
            "enabled": true,
            "punishment": "none",
            "maxScaffoldDiff": 1,
            "minVlbeforePunishment": 10
        },
        "scaffoldF": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "fastuseA": {
            "enabled": true,
            "use_delay": 170,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "fastuseB": {
            "enabled": true,
            "min_eat_delay": 20,
            "punishment": "none",
            "items": [
                "minecraft:apple",
                "minecraft:golden_apple",
                "minecraft:enchanted_golden_apple"
                
            ],
            "minVlbeforePunishment": 0
        },
        "killauraE": {
            "enabled": true,
            "punishment": "none",
            "entities": [
                "minecraft:arrow",
                "minecraft:xp_bottle",
                "minecraft:xp_orb"
            ], 
            "minVlbeforePunishment": 0
        },
        "autoclickerB": {
            "enabled": true,
            "punishment": "ban",
            "minCPS": 3,
            "minCpsDiff": 0.81,
            "maxCpsDiff": 0.96,
            "punishmentLength": "21d",
            "minVlbeforePunishment": 3
        },
        "reachC": {
            "enabled": true,
            "reach": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "reachD": {
            "enabled": true,
            "reach": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "speedA": {
            "enabled": true,
            "speed": 0.33,
            "punishment": "ban",
            "punishmentLength": "12h",
            "minVlbeforePunishment": 50 
        },
        "movementC": {
            "enabled": true,
            "minDistance": 3,
            "maxDistance": 10,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "antishulkerA": {
            "enabled": true,
            /*
            Having antibypass on will not allow peole without op to have chests or barrels, only use this if you have a 
            Kit-PvP like server.
            */
            "antiBypass": false,
            "normalShulkers": "minecraft:shulker_box",
            "punishment": "ban",
            "antiBypassItems": [
                "minecraft:barrel",
                "minecraft:chest",
                "minecraft:trapped_chest"
            ],
            "punishmentLength": "12h",
            "minVlbeforePunishment": 5

        },
        "antikbA" : {
            "enabled": true,
            "punishment": "kick",
            "magnitude": -0.077,
            "minVlbeforePunishment": 10
        },
        "illegalitemsK": {
            "enabled": true,
            "exclude_scythe_op": true,
            "entities": [
                "minecraft:chest_boat",
                "minecraft:chest_minecart"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "antigriefA": {
            "enabled": true,
            "item": "minecraft:flint_and_steel"
        },
        "antigriefB": {
            "enabled": true,
            "exculsions": [
                /*
                if you have any explosives being used on your realm/server add them in the exculsions list
                do it like this:
                "minecraft:tnt"
                */
               
            ]
        },
        "flyA": {
            "enabled": true,
            "punishment": "none", 
            "speed": 0.30,
            "minVlbeforePunishment": 0
        },
        "flyB": {
            "enabled": false,
            "minVelocity": 0.001,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "antispamA": {
            "enabled": true,
            "delay": 40
        },
        "resetItemData": {
            "enabled": false,
            "items": [
                "minecraft:armor_stand",
                "minecraft:barrel",
                "minecraft:blast_furnace",
                "minecraft:brewing_stand",
                "minecraft:campfire",
                "minecraft:soul_campfire",
                "minecraft:cauldron",
                "minecraft:chest",
                "minecraft:trapped_chest",
                "minecraft:dropper",
                "minecraft:flower_pot",
                "minecraft:hopper",
                "minecraft:frame",
                "minecraft:glow_frame",
                "minecraft:jukebox",
                "minecraft:lectern",
                "minecraft:chest_minecart",
                "minecraft:hopper_minecart",
                "minecraft:smoker",
                "minecraft:end_gateway",
                "minecraft:sponge"
            ]
        },
        "badpackets6": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 100
        },
        "badpackets7": {
            "enabled": false,
            "minVelocity": 0.001,
            "punishment": "none",
            "minVlbeforePunishment": 100
        },
        "chatFilter": {
            "enabled": true,
        }
    },
    "chatFilterData": {
        "curseWords": [
            "f u c k",
            "sh!t", 
            "dick",
            "d1ck",
            "a$$hole",
            "wanker",
            "t-w-a-t",
            "t w a t",
            "s h i t"
        ]
    },
    "itemLists": {
        "spawnEggs": true,
        "elements": true,
        "cbe_items": [
            "minecraft:beehive",
            "minecraft:bee_nest",
            "minecraft:moving_block",
            "minecraft:axolotl_bucket",
            "minecraft:cod_bucket",
            "minecraft:powder_snow_bucket",
            "minecraft:pufferfish_bucket",
            "minecraft:salmon_bucket",
            "minecraft:tropical_fish_bucket",
            "minecraft:tadpole_bucket",
            "minecraft:dispenser"
        ],
        "antiGriefItems": [
            "minecraft:tnt",
            "minecraft:end_crystal",
            "minecraft:respawn_anchor"
        ],
        "items_semi_illegal": [
            "minecraft:bedrock",
            "minecraft:end_portal_frame",
            "minecraft:dragon_egg",
            "minecraft:monster_egg",
            "minecraft:infested_deepslate",
            "minecraft:mob_spawner",
            "minecraft:budding_amethyst",
            "minecraft:command_block",
            "minecraft:repeating_command_block",
            "minecraft:chain_command_block",
            "minecraft:barrier",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:jigsaw",
            "minecraft:allow",
            "minecraft:deny",
            "minecraft:light_block",
            "minecraft:border_block",
            "minecraft:chemistry_table",
            "minecraft:frosted_ice",
            "minecraft:npc_spawn_egg"
        ],
        "items_very_illegal": [
            "minecraft:flowing_water",
            "minecraft:water",
            "minecraft:flowing_lava",
            "minecraft:lava",
            "minecraft:fire",
            "minecraft:lit_furnace",
            "minecraft:standing_sign",
            "minecraft:wall_sign",
            "minecraft:lit_redstone_ore",
            "minecraft:unlit_redstone_ore",
            "minecraft:portal",
            "minecraft:unpowered_repeater",
            "minecraft:powered_repeater",
            "minecraft:pumpkin_stem",
            "minecraft:melon_stem",
            "minecraft:end_portal",
            "minecraft:lit_redstone_lamp",
            "minecraft:carrots",
            "minecraft:potatoes",
            "minecraft:unpowered_comparator",
            "minecraft:powered_comparator",
            "minecraft:double_wooden_slab",
            "minecraft:standing_banner",
            "minecraft:wall_banner",
            "minecraft:daylight_detector_inverted",
            "minecraft:chemical_heat",
            "minecraft:underwater_torch",
            "minecraft:end_gateway",
            "minecraft:stonecutter",
            "minecraft:glowingobsidian",
            "minecraft:netherreactor",
            "minecraft:bubble_column",
            "minecraft:bamboo_sapling",
            "minecraft:spruce_standing_sign",
            "minecraft:spruce_wall_sign",
            "minecraft:birch_standing_sign",
            "minecraft:birch_wall_sign",
            "minecraft:jungle_standing_sign",
            "minecraft:jungle_wall_sign",
            "minecraft:acacia_standing_sign",
            "minecraft:acacia_wall_sign",
            "minecraft:darkoak_standing_sign",
            "minecraft:darkoak_wall_sign",
            "minecraft:lit_smoker",
            "minecraft:lava_cauldron",
            "minecraft:soul_fire",
            "minecraft:crimson_standing_sign",
            "minecraft:crimson_wall_sign",
            "minecraft:warped_standing_sign",
            "minecraft:warped_wall_sign",
            "minecraft:blackstone_double_slab",
            "minecraft:polished_blackstone_brick_double_slab",
            "minecraft:polished_blackstone_double_slab",
            "minecraft:unknown",
            "minecraft:camera",
            "minecraft:reserved6",
            "minecraft:info_update",
            "minecraft:info_update2",
            "minecraft:lit_deepslate_redstone_ore",
            "minecraft:hard_stained_glass_pane",
            "minecraft:hard_stained_glass",
            "minecraft:colored_torch_rg",
            "minecraft:colored_torch_bp",
            "minecraft:balloon",
            "minecraft:ice_bomb",
            "minecraft:medicine",
            "minecraft:sparkler",
            "minecraft:glow_stick",
            "minecraft:compound",
            "minecraft:powder_snow",
            "minecraft:lit_blast_furnace",
            "minecraft:redstone_wire",
            "minecraft:crimson_double_slab",
            "minecraft:warped_double_slab",
            "minecraft:cobbled_deepslate_double_slab",
            "minecraft:polished_deepslate_double_slab",
            "minecraft:deepslate_tile_double_slab",
            "minecraft:deepslate_brick_double_slab",
            "minecraft:agent_spawn_egg",
            "minecraft:client_request_placeholder_block",
            "minecraft:rapid_fertilizer",
            "minecraft:hard_glass",
            "minecraft:hard_glass_pane",
            "minecraft:exposed_double_cut_copper_slab",
            "minecraft:oxidized_double_cut_copper_slab",
            "minecraft:waxed_double_cut_copper_slab",
            "minecraft:waxed_exposed_double_cut_copper_slab",
            "minecraft:waxed_oxidized_double_cut_copper_slab",
            "minecraft:waxed_weathered_double_cut_copper_slab",
            "minecraft:weathered_double_cut_copper_slab",
            "minecraft:double_wooden_slab",
            "minecraft:double_cut_copper_slab",
            "minecraft:invisible_bedrock",
            "minecraft:piston_arm_collision",
            "minecraft:sticky_piston_arm_collision",
            "minecraft:trip_wire",
            "minecraft:brewingstandblock",
            "minecraft:real_double_stone_slab",
            "minecraft:item.acacia_door",
            "minecraft:item.bed",
            "minecraft:item.beetroot",
            "minecraft:item.birch_door",
            "minecraft:item.cake",
            "minecraft:item.camera",
            "minecraft:item.campfire",
            "minecraft:item.cauldron",
            "minecraft:item.chain",
            "minecraft:item.crimson_door",
            "minecraft:item.dark_oak_door",
            "minecraft:item.flower_pot",
            "minecraft:item.frame",
            "minecraft:item.glow_frame",
            "minecraft:item.hopper",
            "minecraft:item.iron_door",
            "minecraft:item.jungle_door",
            "minecraft:item.kelp",
            "minecraft:item.nether_sprouts",
            "minecraft:item.nether_wart",
            "minecraft:item.reeds",
            "minecraft:item.skull",
            "minecraft:item.soul_campfire",
            "minecraft:item.spruce_door",
            "minecraft:item.warped_door",
            "minecraft:item.wheat",
            "minecraft:item.wooden_door",
            "minecraft:real_double_stone_slab3",
            "minecraft:real_double_stone_slab4",
            "minecraft:cave_vines",
            "minecraft:cave_vines_body_with_berries",
            "minecraft:cave_vines_head_with_berries",
            "minecraft:real_double_stone_slab2",
            "minecraft:spawn_egg",
            "minecraft:coral_fan_hang",
            "minecraft:coral_fan_hang2",
            "minecraft:coral_fan_hang3",
            "minecraft:cocoa",
            "minecraft:mangrove_standing_sign",
            "minecraft:item.mangrove_door",
            "minecraft:mangrove_wall_sign",
            "minecraft:mud_brick_double_slab",
            "minecraft:mangrove_double_slab",
            "minecraft:item.brewing_stand",
            "minecraft:double_stone_block_slab",
            "minecraft:bleach",
            "minecraft:double_stone_block_slab2",
            "minecraft:double_stone_block_slab3",
            "minecraft:double_stone_block_slab4",
            "minecraft:black_candle_cake",
            "minecraft:blue_candle_cake",
            "minecraft:brown_candle_cake",
            "minecraft:candle_cake",
            "minecraft:cyan_candle_cake",
            "minecraft:gray_candle_cake",
            "minecraft:green_candle_cake",
            "minecraft:light_blue_candle_cake",
            "minecraft:light_gray_candle_cake",
            "minecraft:lime_candle_cake",
            "minecraft:magenta_candle_cake",
            "minecraft:orange_candle_cake",
            "minecraft:pink_candle_cake",
            "minecraft:purple_candle_cake",
            "minecraft:red_candle_cake",
            "minecraft:sweet_berry_bush",
            "minecraft:unlit_redstone_torch",
            "minecraft:white_candle_cake",
            "minecraft:yellow_candle_cake"
        ]
    }
};
