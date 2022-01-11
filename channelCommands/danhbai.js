const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');
const endGame = require('../hostCommands/ketthuc.js').execute;

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}



module.exports={
    name: 'danhbai',
    execute: async function(client, msg, hostChannel, channelsId){
        const channelSend = msg.channel;
        var turn = await DB.get('turn');
        const index = msg.channel.name.split(/-/)[1];
        var cards = await DB.get(`card_${index}`);
        var box = msg.content.split(/ +/);
        const playersID =await DB.get('playersID');
        var result =[];
        const nextPlayer = client.users.cache.get(playersID[(index%4)]);
        
        if(turn[0] !== msg.author.tag.toString()){
            return channelSend.send("Chưa tới lượt của bạn!");
        }

        box.shift();

        if(hasDuplicates(box)||box.length>cards.length) return channelSend.send("Bạn đã không đánh đúng cách!");
        
        await DB.update(`pre_card_${index}`, cards);

        for(let i = 0; i < box.length; i++){
            if(box[i]-1>13||box[i]===1){
                return channelSend.send("Bạn đã không đánh đúng cách!");
            }else if(box[i]==='all'){
                [...result] = cards;
                cards=[];
                break;
            }else{
                result.push(cards[box[i]-1]);
            }
        }    

        hostChannel.send(`${msg.author.username} chuẩn bị đánh!`);
            
        await DB.update('turn', [`${nextPlayer.tag}`]);

        cards = cards.filter(card => !result.includes(card));

        if(cards.length===0){
            let rank = await DB.getRank();

            if(rank===playersID.length){
                await DB.updateRank(1);
                hostChannel.send(`${msg.author} về chót`);
                return endGame.execute(client, msg, channelsId);
            }else if(playersID.length-rank===1){
                sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
                
                hostChannel.send(`${msg.author} về thứ: ${rank}`);
                
                await DB.updateRank(1);
                
                hostChannel.send(`${nextPlayer} về chót`);

                return endGame(client, msg, channelsId);
            }else{
                await DB.updateRank(rank+1);
            }
            
            sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);
            
            return hostChannel.send(`${msg.author} về thứ: ${rank}`);
        }

        await DB.update(`card_${index}`, cards);

        sendCards(client, cards, msg.channelId, 'Bài của bạn: ');

        sendCards(client, result, hostChannel.id, `${msg.author.username} đánh: `);

        hostChannel.send(`Tới lượt ${nextPlayer}`);
    }
};