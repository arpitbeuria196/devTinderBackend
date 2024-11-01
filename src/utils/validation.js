const validator = require("validator");

const validateData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName) {
        throw new Error("First name is required.");
    }
    if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name should be between 4 and 50 characters.");
    }
    if (!lastName) {
        throw new Error("Last name is required.");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password.");
    }
};

module.exports = {
    validateData
};
