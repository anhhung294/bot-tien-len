const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('dotenv').config();
const fs = require('fs');
const startGame = require('./services/start-game.js');
const checkChannel = require('./services/check-channel.js');
const endGame = require('./services/end-game.js');
const token = process.env.TOKEN;
const hostID = process.env.HOST_ID;
const firstChannelId = process.env.firstChannelId;
const secondChannelId = process.env.secondChannelId;
const thirdChannelId = process.env.thirdChannelId;
const fourthChannelId = process.env.fourthChannelId;

client.on('messageCreate', msg =>{
    if(!checkChannel(msg.channel.id)) return;
    let channel = msg.channel;
    if(checkChannel(msg.channel.id)){
        switch(msg.content){
            case 'start': {
                startGame(client, channel);
                break;
            }
            case 'end': {
                endGame();
                break;
            }
            default: {
               return;
            }
        }
    }else if(firstChannelId === channel.id){
        channelOneExecute(client, msg);
    }else if(secondChannelId === channel.id){
        channelTwoExecute(client, msg);
    }else if(thirdChannelId === channel.id){
        channelThreeExecute(client, msg);
    }else if(fourthChannelId === channel.id){
        channelFourExecute(client, msg);
    }
});





client.on('ready', () => {
    console.log(`${client.user.username} is already`);
});

client.login(token);