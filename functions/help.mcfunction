# sometimes the gametestapi scoreboard value doesnt apply correctly so we apply it again
scoreboard players add Pulse:config gametestapi 0
scoreboard players operation @s gametestapi = Pulse:config gametestapi

tellraw @s {"rawtext":[{"text":"\n§l§cPulse AntiCheat Command Help"}]}

# alert the player if gametest is disabled
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"\n§l§4Gametest Is disabled!"}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§l§4Please enable gametest and education edition in world settings."}]}

tellraw @s {"rawtext":[{"text":"\n§l§aModeration Commands"}]}

# Gametest enabled
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!help§r - Shows this help page."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!ban <username> [time] [reason]§r - Ban the specified user."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!kick <username> [reason]§r - Kick the specified user."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!mute <username> [reason]§r - Mute the specified user."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!unmute <username> [reason]§r - Unmute the specified user."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!notify§r - Enables/Disables cheat notifications."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!credits§r - Shows credits, that's it."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!op <username>§r - Op's a player in Pulse AntiCheat features."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!unban <username> [reason]§r - Unbans the specified player."}]}

# Gametest Disabled
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function help§r - Shows this help page."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function ban§r - Ban the specified user."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function notify§r - Enables/Disables cheat notifications."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function credits§r - Shows credits, that's it."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function op§r - Op's a player in Pulse AntiCheat features."}]}

tellraw @s {"rawtext":[{"text":"\n§l§aOptional Features"}]}

# Gametest enabled
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!modules§r - View all enabled or disabled modules."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!allowgma§r - Enables/disables gamemode 2 (Adventure) to be used."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!allowgmc§r - Enables/disables gamemode 1 (Creative) to be used."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!allowgms§r - Enables/disables gamemode 0 (Survival) to be used."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!removecommandblocks§r - Enables/disables clearing nearby command blocks."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!bedrockvalidate§r - Enables/disables validation of bedrock (Such as in the nether roof or at y=0)."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!overridecommandblocksenabled§r - Forces the commandblocksenabled gamerule to be enabled or disabled at all times."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!npc§r - Enables/disables killing all NPC's."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!worldborder§r - Enables/disables the world border and its size."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!xray§r - Enables/disables the anti-xray check."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!autoclicker§r - Enables/disables anti-autoclicker."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!autoban§r - Enables/disables auto-banning."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!antishulker§r - Enables/disables Anti Shulker."}]}

# Gametest disabled
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/modules§r - View all enabled or disabled modules."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/allowGMA§r - Enables/disables gamemode 2 (Adventure) to be used."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/allowGMC§r - Enables/disables gamemode 1 (Creative) to be used."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/allowGMS§r - Enables/disables gamemode 0 (Survival) to be used."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/removeCommandBlocks§r - Enables/disables clearing nearby command blocks."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/bedrockValidate§r - Enables/disables validation of bedrock (Such as in the nether roof or at y=-64)."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function overideCommandBlocksEnabled§r - Forces the commandblocksenabled gamerule to be enabled or disabled at all times."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/npc§r - Enables/disables killing all NPCs."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/worldborder§r - Enables/disables the world border and its size."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/xray§r - Enables/disables the anti-xray check."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/autoclicker§r - Enables/disables anti-autoclicker."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/function settings/autoban§r - Enables/disables auto-banning."}]}

tellraw @s {"rawtext":[{"text":"\n§l§aTools and Utilites"}]}

# Gametest enabled
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!ecwipe <username>§r - Clears a players ender chest."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!fly <username>§r - Enables/disables fly mode in survival."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!freeze <username>§r - Freeze a player and make it so they can't move."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!stats <username>§r - View a specific players anticheat logs."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!fullreport§r - View everyones anticheat logs."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!vanish§r - Enables/disables vanish (Used for spying on suspects)."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!tag <nametag>§r - Adds tag to username in chat window."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!tag <player> <nametag>§r - Adds tag to username in chat window for specific users."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!report <player> [reason]§r - Report a player."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!gui§r - Opens the Pulse Management UI."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!invsee§r - View another players inventory."}]}
tellraw @s[scores={gametestapi=1..}] {"rawtext":[{"text":"§6!testaura§r - Runs a manual killaura check (entity)."}]}

# Gametest disabled
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function tools/ecwipe§r - Clears a players ender chest."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function tools/fly§r - Enables/disables fly mode in survival."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function tools/freeze§r - Freeze a player and make it so they cant move."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function tools/stats§r - View a specific players anticheat logs."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§6/execute <username> ~~~ function tools/vanish§r - Enables/disables vanish (Used for spying on suspects)."}]}
tellraw @s[scores={gametestapi=..0}] {"rawtext":[{"text":"§5/execute <username> ~~~ function tools/aura - Runs a manual killaura check (entity)."}]}

tellraw @s {"rawtext":[{"text":"\nNeed extra help? Ask your question in the support server: https://discord.gg/9m9TbgJ973.\n"}]}
