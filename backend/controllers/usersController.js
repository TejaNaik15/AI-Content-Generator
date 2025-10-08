const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");


const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    subscriptionPlan: "Free",
    monthlyRequestCount: 5,
    apiRequestCount: 0,
  });

  
  newUser.trialExpires = new Date(
    new Date().getTime() + (newUser.trialPeriod || 3) * 24 * 60 * 60 * 1000
  );


  try {
    await newUser.save();
    res.json({
      status: true,
      message: "Registration was successful",
      user: {
        username,
        email,
      },
    });
  } catch (err) {
    res.status(500);
    throw new Error("Registration failed. Please try again.");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if (user.subscriptionPlan === "Free" && user.monthlyRequestCount !== 5) {
    user.monthlyRequestCount = 5;
    await user.save();
  }
  res.status(200).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d", 
  });
  console.log(token);
  
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, 
    sameSite: isProd ? "none" : "lax", 
    maxAge: 3 * 24 * 60 * 60 * 1000, 
    path: '/', 
    domain: isProd ? undefined : undefined 
  });

  
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});

const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id)
    .select("-password")
    .populate("payments")
    .populate("contentHistory");
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ isAuthenticated: !!decoded });
  } catch (e) {
    return res.json({ isAuthenticated: false });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
