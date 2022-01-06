const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS] });
const fs = require('fs');

require('dotenv').config();
const env = process.env;
const token = env.TOKEN;
const hostID = env.HOST_ID;
const PREFIX = env.PREFIX;  

const channelsId = [hostID,env.firstChannelId, env.secondChannelId, env.thirdChannelId, env.fourthChannelId];

const files1 = fs.readdirSync('./hostCommands').filter(file => file.endsWith('.js'));
const hostCommands = new Map();
for(let file of files1){
    let command = require(`./hostCommands/${file}`);
    hostCommands.set(command.name, command);
}

const files2 = fs.readdirSync('./channelCommands').filter(file => file.endsWith('.js'));
const channelCommands = new Map();
for(let file of files2){
    let command = require(`./channelCommands/${file}`);
    channelCommands.set(command.name, command);
}

client.on('messageCreate', msg =>{
    let command = msg.content.slice(PREFIX.length).split(/ +/).shift();
    let channelSendID = msg.channelId;
    if(msg.author.bot || !msg.content.startsWith(PREFIX))return;
    if(!channelsId.includes(channelSendID)) return;
    channelsId.shift();
    if(hostID===channelSendID&&hostCommands.has(command)) return hostCommands.get(command).execute(client, msg, channelsId);
    else if(channelsId.includes(channelSendID)&&channelCommands.has(command)) return channelCommands.get(command).execute(client, msg, client.channels.cache.get(hostID));
});



client.on('ready', () => {
    console.log(`${client.user.tag} is already`);
});

client.login(token);