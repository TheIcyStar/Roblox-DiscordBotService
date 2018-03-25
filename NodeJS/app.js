const discord = require("discord.js");
const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");

const expressApp = express();
const client = new discord.Client();
const settings = require("./settings.json");
const userSettings = require("./users.json");

var prefix = "!" //BOT PREFIX
var botStart = 0;
var restarts = -1;

var apiCalls = 0;
var commands = 0;

expressApp.use(bodyParser.json());



//  -------------------
//	Express server code
//  -------------------

expressApp.get("/", function (req, res) {
	//console.log("Connection!");
	res.send("thanks for checking out my web server. Now check out this video instead: https://www.youtube.com/watch?v=k55FYtqtXXU");
});

expressApp.post("/api/bots", function (req, res) {
	apiCalls = apiCalls + 1;
	//console.log("API call");

	//todo: rewrite to make code scale better with more operations
	if (req.body.key === userSettings.Operations.MainUser.apikey) {

		var channel = client.guilds.get(userSettings.Operations.MainUser.guildId).channels.find("name", req.body.channel);
		if (channel) {
			if (req.body.messageType == "plaintext") {
				channel.send(req.body.message.text);
			} else if (req.body.messageType == "playerProfile") {
				const options = {
					"playerId": req.body.message.playerId,
					"playerName": req.body.message.playerName,
					"text": req.body.message.text
				};
				sendFeedbackMessage(channel, options);
			}
			res.send("success");
		} else {
			res.status(404).send('Could not find channel name');
		}


	} 
	/* Use else if statements if you would like to have multiple API keys running
	else if (req.body.key === userSettings.Operations.AnotherUser.apikey) {

		var channel = client.guilds.get(userSettings.Operations.AnotherUser.guildId).channels.find("name", req.body.channel);
		if (channel) {
			if (req.body.messageType == "plaintext") {
				channel.send(req.body.message.text);
			} else if (req.body.messageType == "playerProfile") {
				const options = {
					"playerId": req.body.message.playerId,
					"playerName": req.body.message.playerName,
					"text": req.body.message.text
				};
				sendFeedbackMessage(channel, options);
			}
			res.send("success");
		} else {
			res.status(404).send('Could not find channel name');
		}

	*/
	}else {
		res.send("invalid key!");
	}
});

expressApp.listen(3000);
console.log("Running express on port 3000...");





//  ----------------
//	Discord bot code
//  ----------------

//Get the profile picture of the player and then publish the full feedback message
//CHANNEL channel to send to; OBJECT msgInfo of the message to be processed
function sendFeedbackMessage(channel, msgInfo) {
	//console.log("sendFeedbackMSg");
	var url = "https://www.roblox.com/bust-thumbnail/json?userId=" + msgInfo.playerId + "&height=180&width=180";
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {

			const embed = new discord.RichEmbed()
				.setColor(0x00AE86) //hex color code for the embed message
				.setThumbnail(body.Url) //process user id to get profile picture
				.setDescription("**" + msgInfo.playerName + "** \n *" + msgInfo.text + "*\n\n `UserID: " + msgInfo.playerId + "`"); //the good stuff that displays the text
			channel.send(embed);
		} else {
			console.log("response bad");
			console.log(response.statusCode);
		}
	})
}

//on client start
client.on("ready", rdy => {
	console.log("Bot started, ready to roll!");
	restarts += 1;
	botStart = Math.floor(new Date() / 1000);
});

//on message
client.on("message", msg => {
	if (!msg.content.startsWith(prefix) || msg.channel.name !== userSettings.Operations.MainUser.commandChannelName) {
		return "";
	};
	commands = commands + 1;

	//later: figure out how to manage per-guild settings
	if (msg.content === prefix + "help" || msg.content === prefix + "commands") {
		msg.channel.send("***Roblox-DiscordBotService - check out the github! https://github.com/TheIcyStar/Roblox-DiscordBotService*** \n" +
			"Availible commands: **!help**, **!giveExample**, **!uptime** \n" +
			//"add more lines if needed...." +
			"");
	} else if (msg.content === prefix + "giveExample") {
		const example = {
			"game_name": "Example game",
			"playerId": "28969907",
			"playerName": "OnlyTwentyCharacters",
			"text": "Game's real good but there's not enough fish in it. Something something Text Here"
		};
		sendFeedbackMessage(msg.channel, example);
	} else if (msg.content === prefix + "uptime") {
		msg.channel.send("*This bot has been up for*  **" + (Math.floor(new Date() / 1000) - botStart) + "** *seconds and has restarted*  **" + restarts + "** times.");
	} else if (msg.content === prefix + "stats") {
		
		//easter egg, if rng rolls a 15
		var easteregg = Math.floor(Math.random() * Math.floor(16))
		if (easteregg < 15) {
			msg.channel.send("*Since start, there has been*  **" + apiCalls + "** *api calls,*  **" + commands + "** *commands, and*  **0** *plots for world domination.*");
		} else {
			msg.channel.send("*Since start, there has been*  **" + apiCalls + "** *api calls,*  **" + commands + "** *commands, and*  **1** *plot for world domination.*");
		}
		
	} else if (msg.content === prefix + "version") {
		msg.channel.send("*Running version*  " + settings.version);
	}
});


client.login(settings.token);