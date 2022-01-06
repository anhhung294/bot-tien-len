//jshint esversion: 8
const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');

const cards = ['1-spades','2-spades','3-spades','4-spades','5-spades','6-spades','7-spades','8-spades','9-spades','10-spades','11-spades','12-spades','13-spades','1-hearts','2-hearts','3-hearts','4-hearts','5-hearts','6-hearts','7-hearts','8-hearts','9-hearts','10-hearts','11-hearts','12-hearts','13-hearts','1-clubs','2-clubs','3-clubs','4-clubs','5-clubs','6-clubs','7-clubs','8-clubs','9-clubs','10-clubs','11-clubs','12-clubs','13-clubs','1-diamonds','2-diamonds','3-diamonds','4-diamonds','5-diamonds','6-diamonds','7-diamonds','8-diamonds','9-diamonds','10-diamonds','11-diamonds','12-diamonds','13-diamonds'];

const shuffledCards = function(cards){
    for(let i=0; i< Math.floor(Math.random()*50);i++){
        cards.sort((a,b)=> 0.5- Math.random());
    }  
    return [cards.slice(0,13), cards.slice(13,26),cards.slice(26,39), cards.slice(39)];
};

module.exports={
    name : 'start',
    execute : async function(client, msg, channelsId){
        var playersID = [];
        const hostChannel = msg.channel;

        await new Promise(function(resolve, reject) {
            resolve(hostChannel.send('Vui lòng tag tên các người chơi!'));
        });
         
        const comCards = shuffledCards(cards);

        for(let i = 1; i <= 4 ;i++){
            sendCards(client, comCards[i-1], channelsId[i-1]);
          
            if(!DB.get(`card_${i}`)){
                DB.save(`card_${i}`, comCards[i-1]);
            }else{
                DB.update(`card_${i}`, comCards[i-1]);
            }
        }

        client.once('messageCreate',async message => {
            let channelSendID = message.channelId;
            if(message.author.bot || !channelsId.includes(channelSendID)) return;
            if(message.mentions.users.size > 4) return hostChannel.send('Số người chơi quá mức cho phép! (2-4 người) \n Vui lòng bắt đầu lại!');
            else{
                [...playersID] = await new Promise((resolve, reject) => {
                    resolve(message.mentions.users.keys());
                });
                if(!DB.get('playersID')){
                    DB.save('playersID', playersID);
                }else{
                    DB.update('playersID', playersID);
                }
                for(let i =0; i< playersID.length;i++){
                    let member = message.mentions.members.get(playersID[i]);
                    let role = message.guild.roles.cache.find(r => r.name === `player-${i+1}`);
                    member.roles.add(role);
                }
            }
        });
    }
};