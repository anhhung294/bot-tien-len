const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');
const endGame = require('../hostCommands/end.js');

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}



module.exports={
    name: 'danhbai',
    execute: async function(client, msg, hostChannel, channelsId){
        let channelSend = msg.channel;
        let index = msg.channel.name.split(/-/)[1];
        let cards = await DB.get(`card_${index}`);
        let box = msg.content.split(/ +/);
        let result =[];
        let playersID = DB.get('playersID');
        
        box.shift();

        if(hasDuplicates(box)||box.length>cards.length) return channelSend.send("Bạn đã không đánh đúng cách!");

        hostChannel.send(`${msg.author.username} chuẩn bị đánh!`);
        
        for(let i = 0; i < box.length; i++){
            result.push(cards[box[i]-1]);
        }    

        cards = cards.filter(card => !result.includes(card));

        if(cards.length===0){
            let rank = await DB.get('rank')[0];
            
            if(parseInt(rank)===playersID.length){
                DB.update('rank', '1');
                hostChannel.send(`${msg.author.username} về chót`);
                return endGame.execute(client, msg, channelsId);
            }else{
                DB.update('rank', (parseInt(rank)+1).toString());
            }
            
            sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
            
            return hostChannel.send(`${msg.author.username} về thứ: ${rank}`);
        }

        await DB.update(`card_${index}`, cards);

        sendCards(client, cards, msg.channelId, 'Bài của bạn: ');

        sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
    }
};