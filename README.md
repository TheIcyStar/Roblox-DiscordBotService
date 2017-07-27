# Roblox-DiscordBotService
A discord bot that takes messages from a roblox game and then published messages to a discord channel.
The information sent from the Roblox game is in JSON. 

The default script simply logs whatever player has joined a server. The game could be modified send out more complex data for the discord bot to process, like player feedback

# Setup & Usage

1) On Roblox, Create a server script and place it into ServerScriptService, and enable HTTPService
2) Copy the contents of /RbxLua/WebhookMessage.lua into the server script.
3) On discord, create two channels. One will be for the spammy json data and one for clean, formatted responses from the discord bot. Hide the data channel for other users as the channel can be spammy.
4) Create a webhook for the data channel, copy its url, and paste the url into the Roblox server script. (The variable is named "targetUrl")

5) Install Node.JS
6) edit the bot's settings.json
	Change the value of "ircChannelName" to the data channel name where you created the webhook in
	Change the value of "displayChannelName" to the channel name where you would like the bot to post the formatted output to
	Create a new discord app at https://discordapp.com/developers/applications/me , copy the token, and paste it into the value of "token"
7) Run the bot!

