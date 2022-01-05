var cards = require('../services/game.js').cardTwo;
module.exports.start = function(client){
    const thisChannel = client.channels.cache.get(process.env.secondChannelId);
	sendYourCards(thisChannel, cards, client);
	thisChannel.send('Nếu bạn muốn sắp xếp bài thì nhập lệnh: \n sapxep [thứ tự mới của bài] ... \n Ví dụ: \n Ban đầu [1] [2] [3]\n Muốn xếp thành: [2] [3] [1] \n sapxep 2 3 1\n ');
	thisChannel.send('Để đánh bài, nhập lệnh: \n danhbai [các lá muốn đánh] \n Ví dụ: Bạn có [1][3-spades] [2][4-spades] [3][5-spades] \n Bạn có thể đánh sảnh 3,4,5 bằng cách nhập lệnh: \n danhbai 1 2 3');
};
module.exports.channelExecute = function(client, msg){	
	const thisChannel = client.channels.cache.get(process.env.secondChannelId);
	let command = msg.content.split(' ').shift();
	const map = require('./readCommands.js');
	if(!map.get(command)) return thisChannel.send('Sai cú pháp lệnh! Vui lòng nhập lại!');
	cards = map.get(command).execute(client, msg, thisChannel,cards);
	sendYourCards(thisChannel, cards, client);	
};
const { MessageEmbed } = require('discord.js');
const sendYourCards = function(channel, cards, client){
    const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Bài của bạn:');
	for(let i = 0; i < cards.length; i++){
		let name = cards[i].split('-').join('');
		switch(name){
			case '3spades':{
				exampleEmbed.addField({
					name: `[${i+1}][3-spades]`,
					value: '[3-spades]',
					inline: true
				});
				break;
			}case '13spades':{
				exampleEmbed.addField({
					name: `[${i+1}][13-spades]`,
					value: '[13-spades]',
					inline: true
				});
				break;
			}default:{
				let emoji = client.emojis.find(e => e.name === name);
				exampleEmbed.addField({
					name: `${cards[i]}`,
					value: `<${emoji.name}:${emoji.id}>`,
					inline: true
				});
				break;
			}
		}
	}
    channel.send({ embeds: [exampleEmbed] });
};