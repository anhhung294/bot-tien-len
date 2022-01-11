const DB =require('../interactWithDB.js');
module.exports = {
    name: 'boqua',
    execute: async function(client, msg, hostChannel, channelsId){
        const index = msg.channel.name.split('-')[1];
        const playersID =await DB.get('playersID');
        const player = client.users.cache.get(playersID[(index%4)]);
        const turn = await DB.get('turn')[0];
        
        if(turn !== msg.author.tag){
            return channelSend.send("Chưa tới lượt của bạn!");
        }

        hostChannel.send(`${msg.author.username} bỏ lượt! Tới lượt người chơi ${player}`);
    }
};