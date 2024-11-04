const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validateEditProfileData = require("../utils/validation");

// Profile route
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    const user = req.user; // Access the user from userAuth middleware
    res.send(user);
});


profileRouter.patch("profile/edit",userAuth,async (req,res)=>
{
    try {
        if(!validateEditProfileData(req))
        {
            throw new Error("Invalid Edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key]);



        res.send(`{loggedInUser.firstName},Profile Updated Successfully`)
        
      await  loggedInUser.save();

    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = profileRouter;
