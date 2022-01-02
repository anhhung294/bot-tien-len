//jshint esversion: 8
var playerInstance=[];
var members =[];
var roles=[];
var isGameStarted = false;
var playerOne =[];
var playerTwo = [];
var playerThree = [];
var playerFour = [];
const distributeCards = function(members, Channels){
    const cards = ['1-spades', '1-hearts', '1-diamonds', '1-clubs', '2-spades', '2-hearts', '2-diamonds','2-clubs', '3-spades', '3-hearts', '3-diamonds', '3-clubs', '4-spades', '4-hearts', '4-diamonds', '4-clubs', '5-spades', '5-hearts', '5-diamonds', '5-clubs', '6-spades', '6-hearts', '6-diamonds','6-clubs', '7-spades', '7-hearts', '7-diamonds', '7-clubs','8-spades', '8-hearts', '8-diamonds', '8-clubs','9-spades', '9-hearts', '9-diamonds', '9-clubs','10-spades', '10-hearts', '10-diamonds', '10-clubs', '11-spades', '11-hearts', '11-diamonds', '11-clubs', '12-spades', '12-hearts', '12-diamonds', '12-clubs', '13-spades', '13-hearts', '13-diamonds', '13-clubs'];
    for(let i =0; i< Math.floor(Math.random()*10);i++){
        cards.sort(() => Math.random() - 0.5);
    }
    playerOne= cards.slice(0,13);
    playerTwo= cards.slice(13,26);
    playerThree = cards.slice(26,39);
    playerFour = cards.slice(39);
    module.exports.cardOne = playerOne;
    module.exports.cardTwo = playerTwo;
    module.exports.cardThree = playerThree;
    module.exports.cardFour = playerFour;
}
module.exports = async function(client, channel){
    const Channels = [client.channels.cache.get(process.env.firstChannelId),client.channels.cache.get(process.env.secondChannelId),client.channels.cache.get(process.env.thirdChannelId),client.channels.cache.get(process.env.fourthChannelId)]; 
    await channel.send('Vui lòng tag tên những người chơi');
    client.once('messageCreate', msg =>{
        [...playerInstance]= msg.mentions.users.keys();
        if(playerInstance.length>4){
            playerInstance=[];
            channel.send('Quá số lượng người chơi cho phép!');
            channel.send('start');
            return;
        }else if(isGameStarted) return channel.send('Ván trước chưa kết thúc!');
        isGameStarted=true;
        for(let i=0; i< playerInstance.length; i++){
            members.push(msg.mentions.members.get(playerInstance[i]));
            roles.push(msg.guild.roles.cache.find(r => r.name === `player-${i+1}`));
            members[i].roles.add(msg.guild.roles.cache.find(r => r.name === `player-${i+1}`));
        }
        distributeCards(members, Channels);
        const ok = require('../channelExecute/channel-1.js');
        ok(client);
    });
    
};
