const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json());
//signup
app.post("/signup",async (req,res)=>
{
   try 
   {
     const user =new User(req.body);
     await user.save();
     console.log(req.body);
     res.send("User Saved Successfully");
   } 
   catch (error) 
   {
        res.status(400).send("Something went wrong"); 
   }
})
//delete
app.delete("/user",async(req,res)=>
{
    const userId = req.body.userId;
    const data = req.body;
    try 
    {
        const  user = await User.findByIdAndDelete({_id:userId});
        res.send("user deleted successfully");
        
    } catch (error) {
        res.status(400).send("Something went wrong"); 
    }
})
//GetByEmail
app.get("/user",async(req,res)=>
{
    const email = req.body.emailId;
    try 
    {
        const user = await User.find({emailId:email});

        res.send(user);
        
    } catch (error) 
    {
        return res.status(404).send("User not found");
        
    }
})
//feed
app.get("/feed",async(req,res)=>
{
    try {
        const users = await User.find({});

        res.send(users)
    } catch (error) {
        return res.status(404).send("User not found");
    }
})

//update
app.patch("/user",async (req,res)=>
{
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("user updated successfully");
        
    } catch (error) {
        res.status(400).send("Something went wrong"); 
    }
})










connectDB().then(()=>{
    console.log("Database connection is established");
    app.listen(7777,()=>
        {
            console.log("Server is listening on port number 7777");
        });
})
.catch((err)=>{
    console.error("Database cannot be connected");
})





