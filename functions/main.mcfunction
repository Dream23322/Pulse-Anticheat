# Run all the checks
function checks/angle
function checks/cbe
function checks/illegalitems
function checks/others
function checks/killaura
function checks/killaura2

#runs protections
execute @s[type=player] ~~~ function pulse/protection/systems/op

# Specific criteria checks
execute @s[type=player,tag=isBanned,scores={gametestapi=..0}] ~~~ function checks/ban

tag @a[scores={killauravl5..}] add killauraBan

# Optional checks
execute @s[type=player,tag=!op,m=a,scores={gma=1..}] ~~~ function checks/optional/gamemodeA
execute @s[type=player,tag=!op,m=c,scores={gmc=1..}] ~~~ function checks/optional/gamemodeC
execute @s[type=player,tag=!op,m=s,scores={gmc=1..}] ~~~ function checks/optional/gamemodeS
execute @s[scores={commandblocks=1..}] ~~~ function checks/optional/nocommandblocks
execute @s[scores={cmds=1..}] ~~~ function checks/optional/overridecommandblocksenabled
