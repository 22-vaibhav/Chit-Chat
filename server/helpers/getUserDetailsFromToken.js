const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const getUserDetailsFromToken = async(token) => {
    if (!token) {
        return {
            message: "session out",
            logout: true,
        }
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decode.id).select("-password");

    return user;
}

module.exports = getUserDetailsFromToken; 