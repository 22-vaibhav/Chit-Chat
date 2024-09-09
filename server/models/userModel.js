const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide NAME"]
    },
    email: {
        type: String,
        required: [true, "Provide EMAIL"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide PASSWORD"]
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
})


const userModel = mongoose.model('User', userSchema)

module.exports = userModel;