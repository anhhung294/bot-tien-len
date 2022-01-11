const DB =require('../interactWithDB.js');
module.exports = {
    name: 'boqua',
    execute: async function(client, msg, hostChannel, channelsId){
        const index = msg.channel.name.split('-')[1];
        const playersID =await DB.get('playersID');
        const nextPlayer = client.users.cache.get(playersID[(index%playersID.length)]);
        const turn = await DB.get('turn');
        
        if(turn[0] !== msg.author.tag){
            return channelSend.send("Chưa tới lượt của bạn!");
        }

        await DB.update('turn', [`${nextPlayer.tag.toString()}`])

        hostChannel.send(`${msg.author.username} bỏ lượt! Tới lượt người chơi ${nextPlayer}`);
    }
};