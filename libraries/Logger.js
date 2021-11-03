const morgan = require ("morgan")
const fs = require("fs")
const path = require("path")
const rfs = require("rotating-file-stream")
const { v4: uuid4 } = require("uuid")

const AppLogger = {};

AppLogger.getAllRequests = () => {

    morgan.token("logAllRequests", function (token, req, res) {
        //  Create Custom ID's For All Requests
        req.appRequestId = uuidv4()
        return JSON.stringify({
            request_id: req.appRequestId,
            methods: token.method(req,res),
            url: tokens.url(req, res),
            response: tokens["response-time"](req,res),
            headers: req.headers["content-type"],
        });
    })

    //  Create A Rotating File Stream - One Log File Per Day
    let accessLogStream = rfs.createStream('access.log', {
        interval: "1d",
        path: path.join(__dirname, "./../logs/")
    })

    morganToken = morgan("logAllRequests", {stream:accessLogStream})

    return morganToken

}

module.exports = AppLogger