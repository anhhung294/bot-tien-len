const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

module.exports = {
    name: 'sapxep',
    execute: async function(client, msg, hostChannel){
        let channelSend = msg.channel;
        let index = msg.channel.name.split(/-/)[1];
        let cards = await DB.get(`card_${index}`);
        let box = msg.content.split(/ +/);
        let result =[];
         
        hostChannel.send(`${msg.author.tag} đang sắp xếp bài!`);

        box.shift();

        if(box.length!==cards.length||hasDuplicates(box)) return channelSend.send("Bạn đã không sắp xếp đúng cách!");
            
        for(let i = 0; i < cards.length; i++){
            result.push(cards[box[i]-1]);
        }

        await DB.update(`card_${index}`, result);

        sendCards(client, result, msg.channelId, 'Bài của bạn: ');
    }
};