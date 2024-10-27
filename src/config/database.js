const mongoose = require('mongoose')


const connectDB = async ()=>
{
    await mongoose.connect("mongodb+srv://NamasteDev:WbZCaANf2udCcwSr@namastenode.uohce.mongodb.net/devTinder");
}

module.exports = connectDB;


