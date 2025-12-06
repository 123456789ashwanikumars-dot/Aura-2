const express =require('express')
const authRouter=express.Router()
const {register,login,logout} =require("../controllers/userAuthontication")
const AuthMiddleware =require("../Middleware/AuthMiddleWare")


// Register
authRouter.post("/register", register)
// Login
authRouter.post("/login", login)
// Logout 
authRouter.post("/logout",logout);


// To Get Detail After login
authRouter.get("/check", AuthMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        email: req.result.email,
        _id: req.result._id,
    }

    res.status(200).json({
        user: reply,
        message: "User Authenticated"
    })
});






module.exports = authRouter;