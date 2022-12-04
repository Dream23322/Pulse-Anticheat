# if the player is already op
tellraw @s[tag=op] {"rawtext":[{"text":"To Pulse-Op someone, please use this command: \"/execute <player_name> ~~~ function op\"."}]}

tellraw @s[tag=!op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r §7You are now op!"}]}
execute @s[tag=!op] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" is now Pulse-Opped."}]}
tag @s[type=player,tag=!sakldidsautuioyfsndvfjksdhfviaosnbdhfjksadhvflia] add sakldidsautuioyfsndvfjksdhfviaosnbdhfjksadhvflia
tag @s[type=player,tag=!op] add op
tag @s[type=player,tag=!laksjdhf] add laksjdhf
