const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES"
    ],
    partials: [
    "CHANNEL"
    ]
});
const fs = require('fs');

require('dotenv').config();
const env = process.env;

const token = env.TOKEN;
const hostID = env.HOST_ID; 

const channelsId = [env.firstChannelId, env.secondChannelId, env.thirdChannelId, env.fourthChannelId];

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
    let command = msg.content.trim().toLowerCase().split(/ +/).shift();
    let channelSendID = msg.channel.id;
    
    if(msg.author.bot || hostID!== channelSendID) return;
    
    if(hostCommands.has(command)){
        hostCommands.get(command).execute(client, msg, channelsId);
    }
    return;
});

client.on('messageCreate', message =>{
    let command = message.content.trim().toLowerCase().split(/ +/).shift();
    let channelSendID = message.channelId;
    
    if(message.author.bot ||!channelsId.includes(channelSendID)) return;

    if(channelCommands.has(command)){
        channelCommands.get(command).execute(client, message, client.channels.cache.get(hostID), channelsId);
    }
    return;
});



client.on('ready', () => {
    console.log(`${client.user.tag} is already`);
});

client.login(token);