const jwt = require('jsonwebtoken');
// const redisClient = require('../config/Redis');
const User = require("../model/user")
const dotenv = require("dotenv");

dotenv.config();  


const userMiddleware = async (req, res, next) => {
    try {

        const token  = req.cookies.token
        if (!token) {
            throw new Error("Token Not Present");

        }

        const payload = jwt.verify(token, process.env.JWT_Token)
        const { _id } = payload
        if (!_id) {
            throw new Error("Invalid Token");

        }

        const result = await User.findById(_id)
        if (!result) {
            throw new Error("User Not Exist");

        }

        req.result = result
        next();


    } catch (error) {
        res.status(401).send("Error " + error.message)

    }
}

module.exports =userMiddleware