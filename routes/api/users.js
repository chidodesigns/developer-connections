//  Express Server & Router
const express = require("express")
    //  Config Vars
const dotenv = require("dotenv")
dotenv.config()
const router = express.Router()
const cors = require('cors')
router.use(cors())
const { check, validationResult } = require("express-validator")
    //  Password Encryption
const bcrypt = require('bcryptjs')
    //  JWT Token 
const jwt = require('jsonwebtoken')
    //  User Gravatar 
const gravatar = require("gravatar")
    //  Model
const User = require("../../models/User")

//  @route      GET api/users
//  @desc       Register User
//  @access     Public
router.post("/", [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please Enter A Password With 6 Or More Characters").isLength({ min: 6 })
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {

            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User Already Exists' }] })
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            const salt = await bcrypt.genSalt(10);
            //  hash user password - overwrite the original user password
            user.password = await bcrypt.hash(password, salt)
                //  save user to db
            await user.save()

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