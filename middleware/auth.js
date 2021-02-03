//  JWT Token
const jwt = require('jsonwebtoken')
    //  Config Vars
const dotenv = require("dotenv")
dotenv.config()

module.exports = (req, res, next) => {
    //  Get Token From Header
    const token = req.header('x-auth-token')
        // Check If No Token 
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" })
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET)
        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" })
    }
}