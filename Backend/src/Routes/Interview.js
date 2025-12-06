const express = require('express')
const interviewRouter = express.Router()
const { question, InterviewResult ,StoreInterview,TotalInterviewConducted,getProblemDetail} = require("../controllers/InterViews.js")
const userMiddleware = require("../Middleware/AuthMiddleWare.js")

interviewRouter.post("/question", userMiddleware, question)
interviewRouter.post("/interviewResult", userMiddleware, InterviewResult)
interviewRouter.post("/interviewResultStore", userMiddleware, StoreInterview)
interviewRouter.post("/totalInterviewConducted", userMiddleware, TotalInterviewConducted)

interviewRouter.post("/getProblemDetail/:id", userMiddleware, getProblemDetail)





module.exports = interviewRouter;
