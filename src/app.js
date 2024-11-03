const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const user = require("./models/user");
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth")

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
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$790 ",{expiresIn:"1d"});
            console.log(token);
            
            //Add token to cookies and send the response back to the user
              res.cookie("token",token,
                {
                    expires:new Date(Date.now() + 8 *36000000)
                }
              );
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
//profile
app.get("/profile",userAuth,async (req,res )=>
{   
    const user = await User.findById(_id);
    if(!user)
    {
        throw new Error("User Doesn't Exist");   
    }
 
    req.user= user;

   // console.log(cookies);
    res.send(user);
})
//sendConnectionRequest
app.post("/sendConnectionRequest",userAuth, async(req,res)=>
{
    const user = req.user;
    console.log("Sending a Connection Request");

    res.send(user.firstName + "Connection Request Sent");
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





