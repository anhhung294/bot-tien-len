const hostID = process.env.HOST_ID;
module.exports = function(channelOfMsg){
    const channelsID = [hostID, process.env.firstChannelId, process.env.secondChannelId, process.env.secondChannelId, process.env.fourthChannelId]
    return channelsID.includes(channelOfMsg);
};