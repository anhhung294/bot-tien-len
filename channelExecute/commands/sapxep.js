module.exports={
    name: 'sapxep',
    execute: function(client, msg, channel, cards){
        messageSplit = msg.content.split(' ');
        messageSplit.shift();
        console.log(messageSplit);
        if(messageSplit.length!== cards.length) return channel.send('Sai sai ở đâu đó rồi! Vui lòng nhập lại!');
        let result = [];
        console.log(messageSplit);
        messageSplit.forEach(item => result.push(cards[item-1]));
        return result;
    }
};