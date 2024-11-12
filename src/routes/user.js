const express = require('express');
const userRouter = express.Router;
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received",userAuth,async (req,res) =>
{
    try 
    {
        const loggedInUser = req.user;

        const connectionrequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender about skills"
        );
        
        res.json({
            message:"Data Fetched Successfully",
            data: connectionrequest
        });
    } catch (error) 
    {
        req.statusCode(400).send("Error:"+error.message);
        
    }
})

//connections
userRouter.get("/user/connections",userAuth, async (req,res)=>
{
    try 
    {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId: loggedInUser._id,status:"accepted"}
            ],
        }).populate("fromUserId",
            "firstName lastName photoUrl age gender about skills"
        )
        
    } catch (error) 
    {
        res.status(400).send({message:error.message})
        
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>
{
    try 
    {
        //User should see all the user cards except his own card
        //0. his own card
        //his connections 
        //ignored people 
        //already sent the connection request

        const loggedInUser = req.user;

        const page = parseInt(req.params.page) || 1;
        let limit = parseInt(req.params.limit) || 10;
        limit = limit>50 ? 50 : limit; 

        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hidenUserFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hidenUserFromFeed.add(req.fromUserId.toString());
            hidenUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hidenUserFromFeed)}},
                {_id:{$ne: loggedInUser._id }}
            ]
        }).select("fromUserId",
            "firstName lastName photoUrl age gender about skills").skip(skip).limit(limit);

        res.send(users);
    } catch (error) 
    {
        res.status(400).json({message: error.message});
        
    }
})

//pagination


module.exports = userRouter;