//  Express
const express = require("express")
    //  Database
const connectDB = require("./config/db")
    //  Server Port
const PORT = process.env.PORT || 5000
    //  Express App
const app = express()
    //  DB Connection
connectDB()
    //  Init Middleware
app.use(express.json({ extended: false }))

app.get("/", (req, res) => {
    res.send("API Running")
})

//  Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

app.listen(PORT, () => {
    console.log(`Server Started On Port ${PORT}`)
})