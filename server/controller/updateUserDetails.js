const userModel = require("../models/userModel");
const getUserDetailsFromToken = require('./../helpers/getUserDetailsFromToken')

async function updateUserDetails(req, res) {
    try {
        const token = req.cookies.token || "";
        const user = await getUserDetailsFromToken(token);

        const { name, profile_pic } = req.body
        
        const updateUser = await userModel.updateOne(
            { _id: user._id },
            {name, profile_pic}
        )

        const userInfo = await userModel.findById(user._id);


        return res.json({
            message: "User updated successfully",
            data: userInfo,
            success: true
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = updateUserDetails;