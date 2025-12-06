const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "src", ".env") });
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
  }
}

module.exports = connectDB;
