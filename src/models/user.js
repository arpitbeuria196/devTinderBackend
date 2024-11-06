const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 


const userSchema = mongoose.Schema({
     
    firstName: {
        type: String,
        required: true,
        index:true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        validate(value) {
            if (value < 18) {
                throw new Error("Age must be at least 18.");
            }
        }
    },
    gender: {
        type: String,
        enum:{
            values:['male','female','other'],
            message:`{VALUE} is not a valid gender type`
        },
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid gender value. Must be 'male', 'female', or 'others'.");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String],
    }
});

userSchema.methods.getJWT = async function ()
{
    const user = this;
   const token = await jwt.sign({_id:user._id},"DEV@Tinder$790 ",{expiresIn:"1d"});

   return token;
}

userSchema.methods.validatePasswords = async function(passwordInputByUser)
{
    const user = this;

    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
