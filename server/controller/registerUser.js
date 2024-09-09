const userModel = require("../models/userModel");
const bcryptjs = require('bcryptjs');

async function registerUser(req, res) {
    try {
        // console.log("register: ", req.body);
        
        const { name, email, password, profile_pic } = req.body
        
        const checkEmail = await userModel.findOne({ email })
        // console.log("chechEmail: ",checkEmail);
        
        
        if (checkEmail) {
            return res.status(400).json({
                message: "User already exist",
                error: true
            })
        }

        // password into hashpassword using bcryptjs

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword
        }

        const user = new userModel(payload);
        const userSave = await user.save();

        return res.status(201).json({
            message: "User created successfully",
            data: userSave,
            success: true
        });

    }
    catch(err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = registerUser;