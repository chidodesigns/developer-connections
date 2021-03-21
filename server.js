//  Express
const express = require("express")
    //  Cors
const cors = require('cors')
    //  Database
const connectDB = require("./config/db")
    //  Server Port
const PORT = process.env.PORT || 5000

    //  Path
const path = require('path')

    //  Express App
const app = express()
    //  DB Connection
connectDB()
    //  Init Middleware
app.use(express.json({ extended: false }))

app.use(cors())

//  Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

//  Serve Static Assets In Prod
if(process.env.NODE_ENV === 'production') {
    //  Set Static Folder
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client',  'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server Started On Port ${PORT}`)
})