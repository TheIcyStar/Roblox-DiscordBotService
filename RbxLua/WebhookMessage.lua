--[[Written by TehIcyStar/TheIcyStar
	Version 1.0.0
	From Roblox-DiscordBotService on GitHub
	MIT License
		INFO: This script sends a json text to an irc channel via a discord webhook. The bot then picks this up, formats it, and puts it into (for example) a game feedback channel.
		INSTALLATION: Turn on HTTPService, place script in ServerScriptService, and adjust config variables
		USAGE: 

--]]

local targetUrl = "" --Discord webhook URL
local GAME_NAME = "" --The name of the game

local http = game:GetService("HttpService")


--Creates a JSON string of information to be picked up by the bot
--String playerName: Boldly displayed at the top of the message
--INT playerId: Used for getting the profile picture for the player
--String text: Used in the display
function newFormattedInfo(playerName,playerId,text)
	local obj = {
		['game_name'] = GAME_NAME,
		['playerName'] = playerName,
		['playerId'] = playerId,
		['text'] = text
	}
	return http:JSONEncode(obj)
end

--Discord API message creation
function NewMSG(content,username,avatar_url)
	local obj = {
		['content'] = content,
		['username'] = username,
		--['avatar_url'] = "https://t6.rbxcdn.com/60b9d2544bc898e189ca1cb1efd36627" --if you want to put an image into the irc channel for some reason, uncomment this.
	}
	return http:JSONEncode(obj)
end



--example "on join" messanger
game.Players.PlayerAdded:connect(function (plyr)
	local msgInfo = newFormattedInfo(plyr.Name,plyr.UserId, plyr.Name.." has joined the game.") --create a message (that is readable by the bot) saying that a player has joined the game
	local msgObj = NewMSG(msgInfo,GAME_NAME)	--then pack that message into a thing that will be sent to discord
	http:PostAsync(targetUrl, msgObj)	--and finally send it to discord
end)