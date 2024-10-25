const mongoose = require('mongoose')


const connectDB = async ()=>
{
    await mongoose.connect("mongodb+srv://NamasteDev:WbZCaANf2udCcwSr@namastenode.uohce.mongodb.net/devTinder");
}

connectDB().then(()=>{
    console.log("Database connection is established");
})
.catch((err)=>{
    console.error("Database cannot be connected");
})
