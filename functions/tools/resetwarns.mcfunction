execute @s[type=player,tag=!reported] ~~~ tellraw @a[tag=notify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":"'s warns has been reset."}]}


execute @s[type=!player] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§6[§cPulse§6]§r §cA non player entity has tried to use the resetwarns command. §7("},{"selector":"@s"},{"text":")"}]}

scoreboard players set @s[type=player,tag=!reported,scores={autoclickervl=1..}] autoclickervl 0
scoreboard players set @s[type=player,tag=!reported,scores={autoshieldvl=1..}] autoshieldvl 0
scoreboard players set @s[type=player,tag=!reported,scores={autototemvl=1..}] autototemvl 0
scoreboard players set @s[type=player,tag=!reported,scores={badenchants=1..}] badenchants 0
scoreboard players set @s[type=player,tag=!reported,scores={badpacketsvl=1..}] badpacketsvl 0
# scoreboard players set @s[type=player,tag=!reported,scores={cbevl=1..}] cbevl 0
scoreboard players set @s[type=player,tag=!reported,scores={crashervl=1..}] crashervl 0
scoreboard players set @s[type=player,tag=!reported,scores={movementvl=1..}] movementvl 0
scoreboard players set @s[type=player,tag=!reported,scores={illegalitemsvl=1..}] illegalitemsvl 0
scoreboard players set @s[type=player,tag=!reported,scores={invalidsprintvl=1..}] invalidsprintvl 0
scoreboard players set @s[type=player,tag=!reported,scores={killauravl=1..}] killauravl 0
scoreboard players set @s[type=player,tag=!reported,scores={invmovevl=1..}] invmovevl 0
scoreboard players set @s[type=player,tag=!reported,scores={liquidinteractvl=1..}] liquidinteractvl 0
scoreboard players set @s[type=player,tag=!reported,scores={namespoofvl=1..}] namespoofvl 0
scoreboard players set @s[type=player,tag=!reported,scores={noslowvl=1..}] noslowvl 0
scoreboard players set @s[type=player,tag=!reported,scores={nukervl=1..}] nukervl 0
scoreboard players set @s[type=player,tag=!reported,scores={spammervl=1..}] spammervl 0
scoreboard players set @s[type=player,tag=!reported,scores={reachvl=1..}] reachvl 0
scoreboard players set @s[type=player,tag=!reported,scores={gamemodevl=1..}] gamemodevl 0
scoreboard players set @s[type=player,tag=!reported,scores={scaffoldvl=1..}] scaffoldvl 0
scoreboard players set @s[type=player,tag=!reported,scores={flyvl=1..}] flyvl 0
scoreboard players set @s[type=player,tag=!reported,scores={speedvl=1..}] speedvl 0
