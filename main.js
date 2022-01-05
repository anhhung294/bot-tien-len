const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('dotenv').config();
const startGame = require('./services/game.js').startGame;
const checkChannel = require('./services/check-channel.js');
const endGame = require('./services/game.js').endGame;
const token = process.env.TOKEN;
const hostID = process.env.HOST_ID;
var isGameStarted = false;

const board = new Map();
channelsID = [process.env.firstChannelId, process.env.secondChannelId, process.env.secondChannelId, process.env.fourthChannelId];
for(let i =0; i< channelsID.length; i++) {
    board.set(channelsID[i], require(`./channelExecute/channel-${i+1}.js`));
}

client.on('messageCreate', msg =>{
   if(!checkChannel(msg.channel.id)) return;
   switch(msg.channel.id){
       case hostID:{
            switch(msg.content){
                case 'start': {
                    startGame(client, msg.channel);
                    isGameStarted=true;
                    break;
                }case 'end':{
                    isGameStarted = false;
                    msg.channel.send('Game over!')
                    break;
                }default: {
                    if(!msg.author.bot) return msg.channel.send('Bạn đã nhập sai cú pháp!');
                    else if(isGameStarted&&!msg.author.bot) return msg.channel.send('Ván trước chưa kết thúc!');
                    break;
                }
            }
            break;
       }default:{
           if(!board.get(msg.channel.id)) return;
           board.get(msg.channel.id).channelExecute(client, msg.channel);
           break;
       }
    } 
});





client.on('ready', () => {
    console.log(`${client.user.tag} is already`);
});

client.login(token);