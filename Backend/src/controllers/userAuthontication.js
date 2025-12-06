const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const dotenv = require("dotenv");

dotenv.config();  // <-- loads variables from .env into process.env



//  Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token valid for 1 hour
  );
};

// REGISTER 
const register = async (req, res) => {
  try {
    const data = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);
    data.role = "user";

    // Create user in DB
    const createUser = await User.create(data);


    const token = jwt.sign({ _id: createUser._id, email: createUser.email }, process.env.JWT_Token, { expiresIn: 60 * 60 }); // 1 hours  // Second

    // Setting the cookies
    res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })  // valid for 1 Hours  // millisecond


    const userResponse = {
      _id: createUser._id,
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      email: createUser.email,
      role: createUser.role,
      profileImage: createUser.profileImage,
      token, // Send token directly
    };

    res.status(201).json({
      user: userResponse,
      message: "Signup Successful",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Error during registration: " + error.message });
  }
};

// LOGIN 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, email: email, role: user.role }, process.env.JWT_Token, { expiresIn: 60 * 60 }); // 1 hours  // Second


    // Setting the cookies
    res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })  // valid for 1 Hours  // millisecond


    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token,
    };




    res.status(200).json({
      user: userResponse,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error during login: " + error.message });
  }
};

// LOGOUT 
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);



    // cookies ko clear kar danga
    res.cookie("token", null, { expires: new Date(Date.now()) });


    res.status(200).json({ message: "Logout successful — please remove token from client" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout: " + error.message });
  }
};

module.exports = { register, login, logout };
