//  Express
const express = require("express")

const { check, validationResult } = require("express-validator")
    //  Config Vars
const dotenv = require("dotenv")
dotenv.config()
    //  Cors
const cors = require('cors')
    //  JWT Token 
const jwt = require('jsonwebtoken')
    //  Password Encryption
const bcrypt = require('bcryptjs')
    //  Middleware
const auth = require('../../middleware/auth')
    //  User Model
const User = require("../../models/User")

const router = express.Router()
router.use(cors())

//  @route      GET api/auth
//  @desc       Test Route
//  @access     Public
router.get("/", auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

//  @route      POST api/auth
//  @desc       Authenticate User - Get Token - Login
//  @access     Public
router.post("/", [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password Is Required").exists()
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {

            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
            }

            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }

            jwt.sign(
                payload,
                process.env.JWTSECRET, {
                    expiresIn: 36000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token: token,
                        userId: payload.user.id,
                        userName: payload.user.name,
                        userEmail: payload.user.email
                    })
                }
            );

        } catch (error) {

            console.error(error.message);
            res.status(500).send("Server Error")

        }

    })



module.exports = router