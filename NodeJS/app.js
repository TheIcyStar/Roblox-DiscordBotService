const discord = require("discord.js");
const request = require("request");
const client = new discord.Client();
const settings = require("./settings.json");

var prefix = "!" //BOT PREFIX

var botStart = 0;
var restarts = -1;

//Get the profile picture of the player and then publish the full feedback message
//CHANNEL channel to send to; OBJECT msgInfo of the message to be processed
function sendFeedbackMessage(channel, msgInfo) {
	console.log("sendFeedbackMSg");
	var url = "https://www.roblox.com/bust-thumbnail/json?userId=" + msgInfo.playerId + "&height=180&width=180";
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(body.Url)//for testing

			const embed = new discord.RichEmbed()
				.setColor(0x00AE86) //hex color code for the embed message
				.setThumbnail(body.Url) //process user id to get profile picture
				.setDescription("**" + msgInfo.playerName + "** \n *" + msgInfo.text + "*\n\n `UserID: " + msgInfo.playerId + "`"); //the good stuff that displays the text
			channel.send({ embed });
		} else {
			console.log("response bad");
		}
	})
}

//on client start
client.on("ready", () => {
	console.log("Bot started, ready to roll!");
	restarts += 1;
	botStart = Math.floor(new Date() / 1000);
});

//on message
client.on("message", msg => {
	if (!msg.content.startsWith(prefix) && !msg.channel.name === settings.ircChannelName){
		return
	};

	if (msg.channel.name === settings.ircChannelName) { //process irc message
		var ircJSON = JSON.parse(msg.content);
		//todo: add a catch for invalid json data
		const feedbackChannel = msg.guild.channels.find("name", settings.displayChannelName);
		//todo: add a catch for invalid feedback channel selection in settings.json
		sendFeedbackMessage(feedbackChannel, ircJSON);
		
	} else { //user commands (user commands are ignored in the irc channel)
		if (msg.content === prefix + "BotUptime") { //shows how long the bot has been up (in seconds), also shows restarts (if any)
			if (Restarts === 0) {
				msg.channel.send("*This bot has been up for* `" + (Math.floor(new Date() / 1000) - botStart) + "` *seconds.*"); //day:hour:minute:second comes another day.
			} else {
				msg.channel.send("*This bot has been up for* `" + (Math.floor(new Date() / 1000) - botStart) + "` *seconds, with* `" + Restarts + "` *restarts*");
			}
		} else if (msg.content === prefix + "TestExample") { //quick test to show the formatting of a sample message. Replies in the same channel as the command was shot.
			const example = {
				"game_name": "Example game",
				"PlayerId": "28969907",
				"PlayerName": "OnlyTwentyCharacters",
				"text": "Game's real good but there's not enough fish in it. Something something Text Here"
			};
			const feedbackChannel = msg.guild.channels.find("name", settings.displayChannelName);
			sendFeedbackMessage(feedbackChannel, example);
		}
	}
});


client.login(settings.token);