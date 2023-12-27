const  jwt  = require("jsonwebtoken");
require('dotenv').config();

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

module.exports = createToken;
