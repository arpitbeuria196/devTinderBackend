const express = require('express');
const authRouter = express.Router();

const { validateData } = require("../utils/validation");
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt= require("bcrypt");



//signup
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login",async (req,res)=>
    {
        try 
        {
            const{emailId, password} = req.body;
            
            const user = await User.findOne({emailId:emailId});
            if(!user)
            {
                throw new Error("EmailID is not present in DB");
            }
            const isPasswordValid = user.validatePasswords(password);
            if(isPasswordValid)
            {
                //Create a JWT Token
                const token = await user.getJWT();
                
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
            res.status(400).send("Error:"+error.message);
            
        }
    })

    module.exports = authRouter;