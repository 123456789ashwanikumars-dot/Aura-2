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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
