const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const user = require("./models/user");
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());
//signup
app.post("/signup", async (req, res) => {
    try {
        // Validation of Data
        validateData(req);

        //password
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash =await bcrypt.hash(password,10);

        console.log(passwordHash);

        // Create and save the user
        const user = new User(
           {
            firstName,
            lastName,
            emailId,
            password: passwordHash
           }
        );
        await user.save();
        
        res.send("User saved successfully");
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(400).send({ error: error.message });
    }
});

//login
app.post("/login",async (req,res)=>
{
    try 
    {
        const{emailId, password} = req.body;
        
        const user = await User.findOne({emailId:emailId});
        if(!user)
        {
            throw new Error("EmailID is not present in DB");
        }
        const isPasswordValid = bcrypt.compare(password,user.password);
        if(isPasswordValid)
        {
            //Create a JWT Token
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$790 ");
            console.log(token);

            //Add token to cookies and send the response back to the user
              res.cookie("token",token);
              res.send("Login Successfully");

        }
        else
        {
            throw new Error("Password is not valid");
        }

    }
    catch (error) 
    {
        res.status(400).send("Error:"+err.message);
        
    }
})
app.get("/profile",async (req,res )=>
{
    const cookies = req.cookies;

    const {token} = cookies;

    if(!token)
    {
        throw new Error("Invalid Token");
    }
    //validate my token
    const decodeMessage = await jwt.verify(token,"DEV@Tinder$790 ");

    const{_id} = decodeMessage;
    console.log("Logged In User is:"+_id);

    const user = await User.findById(_id);
    if(!user)
    {
        throw new Error("User Doesn't Exist");   
    }
 


   // console.log(cookies);
    res.send(user);
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
        res.status(400).send("error.message"); 
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
        "photoUrl",
        "about",
        "gender",
        "age",
        "skills",
    ];

    let isUpdateAllowed = true;

    for (let key in data) {
        if (!ALLOWED_UPDATES.includes(key)) {
            isUpdateAllowed = false;
            break;
        }
    }

    if (!isUpdateAllowed) {
        return res.status(400).send("Update not allowed");
    }

    try {
        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send(error.message); 
    }
});










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





