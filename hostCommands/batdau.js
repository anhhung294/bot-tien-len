//jshint esversion: 8
const DB = require('../interactWithDB.js');
const sendCards = require('../sendCards.js');

const cards = ['1-spades','2-spades','3-spades','4-spades','5-spades','6-spades','7-spades','8-spades','9-spades','10-spades','11-spades','12-spades','13-spades','1-hearts','2-hearts','3-hearts','4-hearts','5-hearts','6-hearts','7-hearts','8-hearts','9-hearts','10-hearts','11-hearts','12-hearts','13-hearts','1-clubs','2-clubs','3-clubs','4-clubs','5-clubs','6-clubs','7-clubs','8-clubs','9-clubs','10-clubs','11-clubs','12-clubs','13-clubs','1-diamonds','2-diamonds','3-diamonds','4-diamonds','5-diamonds','6-diamonds','7-diamonds','8-diamonds','9-diamonds','10-diamonds','11-diamonds','12-diamonds','13-diamonds'];

const shuffledCards = function(cards){
    for(let i=0; i< Math.floor(Math.random()*50);i++){
        cards.sort((a,b)=> 0.5- Math.random());
    }  
    return [cards.slice(0,13).sort((a,b)=> a.split('-')[0]-b.split('-')[0]), cards.slice(13,26).sort((a,b)=> a.split('-')[0]-b.split('-')[0]),cards.slice(26,39).sort((a,b)=> a.split('-')[0]-b.split('-')[0]), cards.slice(39).sort((a,b)=> a.split('-')[0]-b.split('-')[0])];
};

module.exports={
    name : 'batdau',
    execute : async function(client, msg, channelsId){
        var playersID = [];
        const hostChannel = msg.channel;
        const comCards = shuffledCards(cards);

        if(await DB.get('isGameStarted')[0]==='true'){
            return hostChannel.send('Vui lòng kết thúc ván trước');
        }
        
        if(msg.mentions.users.size > 4||msg.mentions.users.size <=1){
            return hostChannel.send('Số người chơi không đúng! (2-4 người) \n Vui lòng bắt đầu lại!');
        }
        else{
            msg.channel.send("Vui lòng chờ một chút!");
            
            [...playersID] = msg.mentions.users.keys();

            await DB.update('isGameStarted', 'true');
                
            await DB.update('playersID', playersID);

            await DB.updateRank(1);

            for(let i =0; i< playersID.length;i++){
                let member = await msg.mentions.members.get(playersID[i]);
                let role = await msg.guild.roles.cache.find(role => role.name === `player-${i+1}`);
                member.roles.add(role);
            }
            for(let i = 1; i <= 4 ;i++){
                let channel = await client.channels.cache.get(channelsId[i-1]);
                
                sendCards(client, comCards[i-1], channelsId[i-1], 'Bài của bạn: ');
               
                channel.send('- Dùng lệnh sapxep [thứ tự mới của bộ bài] để sắp xếp bài \n Ví du: Ban đầu thứ tự là: 1 2 3 4 5 \n Bạn muốn sắp xếp thành: 3 2 4 1 5 thì nhập: \n sapxep 3 2 4 1 5');
                channel.send('- Dùng lệnh danhbai [các lá bài muốn đánh] để đánh bài \n Ví du: Bạn có các lá: 1 2 3 4 5 \n Bạn muốn đánh: 3 2 thì nhập: \n danhbai 3 2');
                channel.send('- Dùng lệnh boqua để bỏ qua lượt.');
                channel.send('- Dùng lệnh danhbai all để đánh tất cả các lá còn lại.');
                
                await DB.update(`card_${i}`, comCards[i-1]);
            }

            for(let i = 0; i < playersID.length; i++){
                let tempCards = await DB.get(`card_${i+1}`);
                if(tempCards.includes('3-spades')){
                    await DB.update('turn', client.users.cache.get(playersID[i]).tag);

                    hostChannel.send(`Người chơi bắt đầu là ${client.users.cache.get(playersID[i])}`);

                    break;
                }
            }

            var checkTurn = await DB.get('turn');

            if(checkTurn[0]===''){
                hostChannel.send('Không người chơi nào có 3 bích!');

                let firstPlayer = client.users.cache.get(playersID[Math.floor(Math.random()*playersID.length)]);

                await DB.update('turn', [`${firstPlayer.tag}`]);

                hostChannel.send(`Lượt bắt đầu sẽ được chọn ngẫu nhiên \nNgười chơi bắt đầu là ${firstPlayer}`);
            }

            return hostChannel.send('Trò chơi bắt đầu!'); 
        }
    }
};