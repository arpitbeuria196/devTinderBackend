
const { model } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req,res,next)=>
{
    //Read the token from the req cookies
    try 
    {
        const {token} = req.cookies;

        if(!token)
        {
            throw new Error("Tokem is not valid");
        }
    
        const decodeObj = jwt.verify(token,"DEV@Tinder$790 ");
    
        const{_id} =decodeObj;
    
        const user = await User.findById(_id);
    
        if(!user)
        {
            throw new Error("User not found");
        }
        req.user = user;
        next();
        
    } catch (error) 
    {
        res.status(400).send("ERROR:"+ error.message);
        
    }
   

    //validate the token
    //Find the user
}

module.exports =
{
    userAuth
}