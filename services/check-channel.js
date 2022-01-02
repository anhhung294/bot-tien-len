const hostID = process.env.HOST_ID;
module.exports = function(channelOfMsg){
    return channelOfMsg === hostID;
};