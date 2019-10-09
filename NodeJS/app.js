const discord = require("discord.js");
const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");

const expressApp = express();
const client = new discord.Client();
const settings = require("./config/settings.json");
const userSettings = require("./config/users.json");

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

	var userGuildId = 0

	if (req.body.key === userSettings.Operations.MainUser.apikey) {
		userGuildId = userSettings.Operations.MainUser.guildId;
	//} else if (req.body.key === userSettings.Operations.AnotherUser.apikey) {
	//	userGuildId = userSettings.Operations.AnotherUser.guildId;
	} else {
		console.log("Somebody used an invalid API key.");
		res.send("invalid key!");
		return;
	}

	var channel = client.guilds.get(userGuildId).channels.find(x => x.name === req.body.channel);
	if (channel) {
		if (req.body.messageType == "plaintext") {
			channel.send(req.body.message.text);
			res.send("success");
		} else if (req.body.messageType == "playerProfile") {
			if(req.body.message.text.length > 1) {
				const options = {
					"playerId": req.body.message.playerId,
					"playerName": req.body.message.playerName,
					"text": req.body.message.text,
					"waitForPictureReady": req.body.waitForPictureReady
				};
				sendFeedbackMessage(channel, options, 0);
				res.send("success");
			} else {
				res.status(400).send('Text is empty');
			}
		}
	} else {
		res.status(404).send('Could not find channel name');
	}
});

expressApp.listen(13000);
console.log("Running express on port 13000...");





//  ----------------
//	Discord bot code
//  ----------------

//Get the profile picture of the player and then publish the full feedback message
//CHANNEL channel to send to; OBJECT msgInfo of the message to be processed
function sendFeedbackMessage(channel, msgInfo) {
	var url = "https://www.roblox.com/bust-thumbnail/json?userId=" + msgInfo.playerId + "&height=180&width=180";
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (msgInfo.waitForProfPic && body.Final === false) {
				console.log("No profile picture ready, waiting. " + body.Url);
				setTimeout(sendFeedbackMessage, 7000, channel, msgInfo);
				return;
			}

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
		msg.channel.send("******Roblox-DiscordBotService "+ settings.version +" - check out the github! https://github.com/TheIcyStar/Roblox-DiscordBotService*** \n" +
			"Running NodeJS "+ process.version +" and forever.js \n" +
			"Availible commands: **!help**, **!giveExample**, **!uptime** \n" +
			"");
	} else if (msg.content === prefix + "giveExample") {
		const example = {
			"playerId": "28969907",
			"playerName": "OnlyTwentyCharacters",
			"text": "Game's real good but there's not enough fish in it. Something something Text Here"
		};
		sendFeedbackMessage(msg.channel, example);
	} else if (msg.content === prefix + "uptime") {
		var seconds = (Math.floor(new Date() / 1000) - botStart);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60) % 24;
		var days = Math.floor(hours / 24);
		msg.channel.send("*This bot instance has been up for*  **" +
		days + "d " +
		(hours%24) + "h " +
		(minutes%60) + "m " +
		(seconds%60) + "s " +
		"**");
	} else if (msg.content === prefix + "stats") {
		msg.channel.send("*Since start, there has been*  **" + apiCalls + "** *api calls,*  **" + commands + "** *commands, and*  **0** *plots for world domination.*");
	}
});


client.login(settings.token);
