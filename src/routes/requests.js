const express = require('express');
const requestRouter = express.Router();
const mongoose = require('mongoose');
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

// sendConnectionRequest
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId.trim();
        const status = req.params.status;

        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).send("Invalid toUserId format");
        }
        
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({message:"Invalid Status Type: "+status});
        }

        //If there is an existing Connection Request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId ,toUserId:fromUserId},
            ]
        })

        if(existingConnectionRequest)
        {
            res.status(400).send({message:"Connection Already Exists!!"});
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request sent successfully!",
            data,
        });

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter;
