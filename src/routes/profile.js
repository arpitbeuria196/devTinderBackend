const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

// Profile route
profileRouter.get("/profile", userAuth, async (req, res) => {
    const user = req.user; // Access the user from userAuth middleware
    res.send(user);
});

module.exports = profileRouter;
