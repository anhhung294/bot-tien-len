const fs = require('fs');
let files = fs.readFileSync('./commands').filter(file => file.endsWith('.js'));
let map = new Map();
for(let file of files){
    let command = require(`./commands/${file}`);
    map.set(command.name, command);
}
module.exports = map;		