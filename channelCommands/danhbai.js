const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}



module.exports={
    name: 'danhbai',
    execute: async function(client, msg, hostChannel){
        var box = msg.content.split(/ +/);
        var result =[];

        box.shift();

        if(box.length!==cards.length||hasDuplicates(box)) return channelSend.send("Bạn đã không đánh đúng cách!");

        hostChannel.send(`${msg.author.tag} chuẩn bị đánh!`);
            
        for(let i = 0; i < cards.length; i++){
            result.push(cards[box[i]-1]);
        }

        await DB.update(`card_${index}`, result);

        sendCards(client, result, hostChannel.id, `${msg.author.name} đánh: `);

        return;
    }
};