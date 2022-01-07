const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');
const endGame = require('../hostCommands/end.js');

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}



module.exports={
    name: 'danhbai',
    execute: async function(client, msg, hostChannel, channelsId){
        var channelSend = msg.channel;
        var index = msg.channel.name.split(/-/)[1];
        var cards = await DB.get(`card_${index}`);
        var box = msg.content.split(/ +/);
        var playersID =await DB.get('playersID');
        var result =[];
        
        box.shift();

        if(hasDuplicates(box)||box.length>cards.length) return channelSend.send("Bạn đã không đánh đúng cách!");

        hostChannel.send(`${msg.author.username} chuẩn bị đánh!`);
        
        for(let i = 0; i < box.length; i++){
            result.push(cards[box[i]-1]);
        }    

        cards = cards.filter(card => !result.includes(card));

        if(cards.length===0){
            let rank = await DB.getRank();

            if(rank===playersID.length){
                DB.updateRank(1);
                hostChannel.send(`${msg.author.username} về chót`);
                return endGame.execute(client, msg, channelsId);
            }else{
                DB.updateRank(rank+1);
            }
            
            sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
            
            return hostChannel.send(`${msg.author.username} về thứ: ${rank}`);
        }

        await DB.update(`card_${index}`, cards);

        sendCards(client, cards, msg.channelId, 'Bài của bạn: ');

        sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
    }
};