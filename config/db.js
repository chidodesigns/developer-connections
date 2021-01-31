const mongoose = require("mongoose")
const config = require("config")
    //  Production App Env
const dotenv = require("dotenv")
dotenv.config()
    //  Local App ENV
const db = config.get("mongoURI")

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true }, { useUnifiedTopology: true })
        console.log("MongoDb Connected...")
    } catch (error) {
        console.error(error.message)
            // Exit Process With Failure
        process.exit(1)
    }
}

module.exports = connectDB