const mongoose = require('mongoose')


const connectDB = async ()=>
{
    await mongoose.connect("mongodb+srv://Arpit196:Gelhu30080@mongodev.uohce.mongodb.net/devTinder");
}

module.exports = connectDB;



