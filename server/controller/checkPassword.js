const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function checkPassword(req, res) {
    try {
        // console.log("checkPassword: ",req.body);
        
        const { password, userId } = req.body;

        const user = await userModel.findById(userId);
        // console.log("user: ", user);
        
        const verifyPassword = await bcryptjs.compare(password, user.password)

        if (!verifyPassword) {
            return res.status(400).json({
                message: "Wrong Password",
                error: true
            })
        }

        const tokenData = {
            id: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        
        const cookieOption = {
            http: true,
            secure: true
        }

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_pic: user.profile_pic
        }

        return res.cookie('token', token, cookieOption).status(200).json({
          message: "Login success",
            token,
          data: payload,
          success: true,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = checkPassword;