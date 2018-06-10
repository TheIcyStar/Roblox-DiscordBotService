# Roblox-DiscordBotService
A discord bot that takes API calls from roblox HTTP requests and creates a message in a discord channel.
This service can be used as a substitute to the now old webhooks.

![image example of result](https://i.imgur.com/W1lg7TP.png)
An example of a possible feedback message sent from a user in a roblox game

This repository has two parts - The NodeJS server that listens for api calls and manages the Discord bot, and an example Lua script that sends messages to this server.

# Setup & Usage

### Project setup

1) Download NodeJS. Prefferably the latest NodeJS LTS release. 

2) Navigate to the NodeJS folder of the repository and run `npm install`
this will install of the necessary dependancies

3) Follow this guide to create a bot: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

4) Copy the "Client Secret" token under APP details and put the token into the `"token"` field in **NodeJS/settings.json.example**

5) Obtain the GuildID of the server that you will be running your bot on and put it into the `"guildId"` field in **NodeJS/users.json.example**
(you can find the guild id by opening up discord's settings and turning on developer mode, then right clicking on the server)

6) Remove the **.example** from **NodeJS/settings.json.example** and **NodeJS/users.json.example**.
(this .example was added to use sensitive data files safely while using git)

6) choose the channel that the bot will listen for commands in and choose an API key. 
(It's highly recommended to use something like a password generator to create your api key. Make sure it is at least 24 characters long)

### Roblox installation

7) Enable HTTPSerice

8) Use the example provided in **RbxLua/ApiCall.Lua** to integrate the api calls into your existing webhook scripts or build a new script from the template. [Check out the wiki for various styles of api calls that you can use](https://github.com/TheIcyStar/Roblox-DiscordBotService/wiki)

### Setting up a Dynamic DNS

(note that this is optional, but it's much nicer to use a special domain name to connect to instead of your IP address, *especially if your ip address changes.*)

9) Go to no-ip.com (or any similar service), create an account, and create a dynamic DNS. You will be using this domain when connecting to your web server from roblox.

10) Put in the URL of your domain into your roblox script. Remember to use a correct port. By default, the port is 3000. So if your domain is `exampleBloxBot.ddns.net`, then you would use `exampleBloxBot.ddns.net:3000` in your urls. (*be sure to add whatever paths are included in the api. By default, your final url should look like this: `http://exampleBloxBot.ddns.net:3000/api/bots`*)

### Running the bot

11) With your command line interface, navigate to the folder and input `node app.js`
