//jshint esversion: 8
const mongoose = require('mongoose');
require('dotenv').config();
const env = process.env;
const urlDB = env.urlDB; 

mongoose.connect(urlDB).then(()=> console.log('Connected to database!'));

const boardComponentsSchema = new mongoose.Schema({
    name: String,
    data: [String]
});    

const boardComponent = new mongoose.model('board_datas', boardComponentsSchema);

const saveData = async function(name, data){
    let component = new boardComponent({
        name: name,
        data: data
    }); 
    await component.save();
};

const getData = async function(name){
    let filter = {
        name: name
    };
    let data = await boardComponent.findOne(filter);
    return data;
};

const updateData = async function(nameOfData, update){
    let filter = {
        name: nameOfData
    };
    let updateData = {
        data : update
    };
    let newBoardComponent = await boardComponent.findOneAndUpdate(filter, updateData);
    return newBoardComponent;
};

module.exports.save = saveData;
module.exports.get= getData;
module.exports.update = updateData;
