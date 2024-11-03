const express = require('express');
const requestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth")

//sendConnectionRequest
requestRouter.post("/sendConnectionRequest",userAuth, async(req,res)=>
    {
        const user = req.user;
        console.log("Sending a Connection Request");
    
        res.send(user.firstName + "Connection Request Sent");
    })
    

module.exports = requestRouter;