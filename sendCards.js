// jshint esversion: 8
const { MessageEmbed } = require('discord.js');

module.exports = function(client,cards ,channelId, title){
    let channel = client.channels.cache.get(channelId);
    
    const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(title);
    
    for(let i=0; i< cards.length; i++){
        let name = cards[i].split('-').join('');
        let nameEmoji = 'default';
        let valueEmoji = 'default';
        
        let emoji = client.emojis.cache.find(emoji => emoji.name === name);
        
        if(name==='3spades'||name==='13spades'){
            nameEmoji = `[${i+1}][${cards[i]}]`;
            valueEmoji= `[${cards[i]}]`;
        }else{
            nameEmoji = `[${i+1}][${cards[i]}]`;
            valueEmoji = `<:${emoji.name}:${emoji.id}>`;
        }

        exampleEmbed.addFields({ 
            name: nameEmoji, 
            value: valueEmoji, 
            inline: true 
        });
    }
    
    channel.send({ embeds: [exampleEmbed] }); 
};