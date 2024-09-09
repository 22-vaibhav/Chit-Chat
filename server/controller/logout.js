async function logout(req, res) {
    try {
        const cookieOption = {
          http: true,
          secure: true,
        };

        return res.cookie('token', '',cookieOption).status(200).json({
            message: "Session Out",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = logout;