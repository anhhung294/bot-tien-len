//jshint esversion: 8
module.exports={
    name : 'start',
    execute : async function(client, msg, channelsId){
        var playersID = [];
        let hostChannel = msg.channel;
        await new Promise(function(resolve, reject) {
            resolve(hostChannel.send('Vui lòng tag tên các người chơi!'));
        });
        client.once('messageCreate', message =>{
            let channelSendID = message.channelId;
            if(message.author.bot || !channelsId.includes(channelSendID)) return;
            if(message.mentions.users.size > 4) return hostChannel.send('Số người chơi quá mức cho phép! (2-4 người) \n Vui lòng bắt đầu lại!');
            else{
                [...playersID] = message.mentions.users.keys();
                console.log(playersID);
            }
        });
    }
};