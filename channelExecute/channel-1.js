const { MessageAttachment, MessageEmbed } = require('discord.js');
var cards = require('../services/start-game.js').cardOne;
module.exports = function(client, msg){
    const thisChannel = client.channels.cache.get(process.env.firstChannelId);
    const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Bài của bạn:')
	.addFields(
		{ name: 'Inline field title', value: '<:kc:>', inline: true },
		{ name: 'Inline field title', value: `https://res.cloudinary.com/dqvlk5yze/image/upload/v1641052348/cards/cards/${cards[1]}.png`, inline: true },
	);
    thisChannel.send({ embeds: [exampleEmbed] });
};