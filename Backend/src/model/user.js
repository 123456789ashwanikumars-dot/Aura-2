const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },

    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol.",
      },
    },

    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
