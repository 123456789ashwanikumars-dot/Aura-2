const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

// Sub-schema for each question
const QuestionSchema = new Schema({
  Question: {
    type: String,
    required: true,
    trim: true,
  },

  Answer: {
    type: String,
    trim: true,
  },

  evaluation: {
    type: String,
    required: true,
    trim: true,
  },

  questionNumber: {
    type: Number,
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },

  userAnswer: {
    type: String,
    required: true,

  },





});

const InterviewModelSchema = new Schema(
  {
    InterViewModelCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    JobPosition: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    JobDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    feedback: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    message: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },



    Experience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },

    mergedData: {
      type: [QuestionSchema], // Now includes Question, Answer, userAnswer, LLMReply
      default: [],
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InterviewModel", InterviewModelSchema);
