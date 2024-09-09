const { response } = require("express");
const userModel = require("../models/userModel");

async function checkEmail(req, res) {
    try {
        // console.log("checkEmail: ", req.body);
        const { email } = req.body;

        const checkEmail = await userModel.findOne({ email }).select("-password");
        // console.log(checkEmail);
        

        if (!checkEmail) {
            return res.status(400).json({
                message: "User not exist",
                error: true
            })
        }

        return res.status(200).json({
            message: "Email verify",
            success: true,
            data: checkEmail
        })
    }
    catch (err) {
        return response.status(500).json({
          message: err.message || err,
          error: true,
        });
    }
}

module.exports = checkEmail;