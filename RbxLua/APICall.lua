--[[Written by TehIcyStar/TheIcyStar
	Version 1.0.0
	From Roblox-DiscordBotService on GitHub
	MIT License
		INFO:	This script sends an api call to the web server, so it can then place a message into a discord channel.
				This is just an example script that would send an api call as soon as a player joins the server.
				This is an **EXAMPLE**. DO NOT actually use this for logging who joins your games.
		
		INSTALLATION: Place in ServerScriptService. HTTPEnabled must be true.
--]]
local targetUrl = "http://www.example.com:13000/api/bots"

local http = game:GetService("HttpService")


--Discord API message creation
function NewJSON(message)
	--[
	local obj = {
		['key'] = "Your key",
		["messageType"] = "plaintext",
		["channel"] = "general",
		["message"] = {
			["text"] = "Hello world from a roblox server!"
		}
	}
	--]]


	--[[
	local obj = {
		['key'] = "Your key",
		["messageType"] = "playerProfile",
		["channel"] = "general",
		["waitForPictureReady"] = true,
		["message"] = {
			["text"] = "Feedback from a roblox server!",
			["playerName"] = "OnlyTwentyCharacters",
			["playerId"] = 28969907
		}
	}
	--]]
	
	return http:JSONEncode(obj)
end

--Main "on join" messenger
game.Players.PlayerAdded:connect(function (plyr)
	
	local response = http:PostAsync(targetUrl,NewJSON())
	
	print("Response: "..response)
end)
