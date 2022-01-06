//jshint esversion: 8
const DB = require('../interactWithDB.js');

module.exports ={
    name: 'end',
    execute: async function(client, msg, channelsId){
        msg.reply('Vui lòng chờ 30s trước khi bắt đầu ván mới!');
            
        const guild = client.guilds.cache.get(789138759173144586);
        const playersID = await DB.get('playersID');
        
        await DB.update('isGameStarted', 'false');
        
        for(let i =0; i< playersID.length;i++){
            let member = await guild.members.fetch(playersID); 
            let role = await msg.guild.roles.cache.find(role => role.name === `player-${i+1}`);
            member.roles.remove(role);
        }
        
        for(let i = 0; i < channelsId.length; i++){
            let channel = await client.channels.cache.get(channelsId[i]);
            let messages  = await channel.messages.fetch();
            let iteratorMess = messages.keys();
            
            for(let i=0; i< messages.size; i++){
                let id = iteratorMess.next().value;
                channel.messages.fetch(id)
                .then(message => message.delete());
            }
        }

        msg. channel.send("Có thể bắt đầu ván mới ngay lúc này!");
    }
};