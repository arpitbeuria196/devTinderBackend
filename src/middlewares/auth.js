const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        // Read the token from cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Error: Token is not provided");
        }

        // Verify the token
        const decodeObj = jwt.verify(token, "DEV@Tinder$790");

        const { _id } = decodeObj;

        // Find the user by ID
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send("Error: User not found");
        }

        // Attach user to request and proceed
        req.user = user;
        next();
        
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).send("Error: Invalid or expired token");
        }
        res.status(500).send("Error: " + error.message);
    }
};

module.exports = {
    userAuth
};
