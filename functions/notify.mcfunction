tag @s[tag=notify] add nonotify
tag @s[tag=nonotify] remove notify
tellraw @a[tag=nonotify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" §rhas disabled cheat notifications."}]}

tag @s[tag=!nonotify] add notify
tellraw @a[tag=notify,tag=!nonotify] {"rawtext":[{"text":"§r§6[§cPulse§6]§r "},{"selector":"@s"},{"text":" §rhas enabled cheat notifications."}]}

tag @s[tag=nonotify] remove nonotify
