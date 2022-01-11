const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');

module.exports ={
    name: 'danhlai',
    execute: async function(client, msg, hostChannel, channelsId){
        const index = msg.channel.name.split(/-/)[1];
        const preCards = await DB.get(`pre_card_${index}`);

        await DB.update(`card_${index}`, preCards);

        hostChannel.send(`Người chơi ${msg.author.username} đang thực hiện lại lượt của mình.`);

        await DB.update('turn', [`${msg.author.tag}`]);

        sendCards(client, preCards, msg.channelId, 'Bài của bạn: ');
    }
};