const express = require('express');
const requestRouter = express.Router();
const mongoose = require('mongoose');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");  // <-- Add this line to import the User model
const { userAuth } = require("../middlewares/auth");

// sendConnectionRequest
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId.trim();
        const status = req.params.status;

        // Validate toUserId format
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).send("Invalid toUserId format");
        }

        // Check if status is valid
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status Type: " + status });
        }

        // Find the user with toUserId
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        
        // Check if a connection request already exists
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Already Exists!!" });
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName+" is "+status+" in "+ toUser.firstName,
            data,
        });

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter;
