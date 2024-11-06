const express = require('express');
const authRouter = express.Router();
const { validateData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup
authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of Data
        validateData(req);

        // Extract data
        const { firstName, lastName, emailId, password } = req.body;

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        
        res.send("User saved successfully");
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(400).send({ error: error.message });
    }
});

// login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Email ID is not present in DB");
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Password is not valid");
        }

        // Create a JWT Token
        const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "8h" });
        
        // Add token to cookies and send response
        res.cookie("token", token, {
            httpOnly: true,  // Prevents client-side JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production",  // Use secure cookie in production
            expires: new Date(Date.now() + 8 * 3600000)  // 8 hours
        });
        res.send("Login Successfully");

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

// logout
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now())  // Expire the cookie immediately
    });
    res.send("Logout Successfully");
});

module.exports = authRouter;
