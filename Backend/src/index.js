const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/DataBase");
const userAuth = require("./Routes/authantication")

const InterViews = require("./Routes/Interview")


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://aura-frontend-ojiy.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/auth", userAuth)

app.use("/interview", InterViews)


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});


