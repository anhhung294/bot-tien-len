const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

require('dotenv').config();
const env = process.env;
const token = env.TOKEN;
const hostID = env.HOST_ID;

const channelsId = [hostID,env.firstChannelId, env.secondChannelId, env.thirdChannelId, env.fourthChannelId];

const files = fs.readdirSync('./hostCommands').filter(file => file.endsWith('.js'));
const hostCommands = new Map();
for(let file of files){
    let command = require(`./hostCommands/${file}`);
    hostCommands.set(command.name, command);
}

client.on('messageCreate', msg =>{
    let command = msg.content.split(' ').shift();
    let channelSendID = msg.channelId;
    if(msg.author.bot || !channelsId.includes(channelSendID)) return;
    if(hostID===channelSendID&&hostCommands.has(command)) return hostCommands.get(command).execute(client, msg, channelsId);
});





client.on('ready', () => {
    console.log(`${client.user.tag} is already`);
});

client.login(token);