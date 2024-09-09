const getUserDetailsFromToken = require('./../helpers/getUserDetailsFromToken')

async function userDetail(req, res) {
    try {
        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token);
        return res.status(200).json({
            message: "User Details",
            data: user
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = userDetail;