//jshint esversion: 8
const DB = require('../interactWithDB.js');
require('dotenv').config();
const GUILD_ID = process.env.GUILD_ID;

module.exports ={
    name: 'end',
    execute: async function(client, msg, channelsId){
        if(await DB.get('isGameStarted')[0] === 'true'){
            return msg.channel.send('Chưa bắt đầu trò chơi!');
        }

        msg.reply('Vui lòng chờ 30s trước khi bắt đầu ván mới!');
            
        const guild = client.guilds.cache.get(GUILD_ID);
        const playersID = await DB.get('playersID')[0];
        
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

        return msg.channel.send("Có thể bắt đầu ván mới ngay lúc này!");
    }
};