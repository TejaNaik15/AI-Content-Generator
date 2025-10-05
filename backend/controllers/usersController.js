const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

//------Registration-----
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //Validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  //Check the email is taken
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  // Always set Free plan and 5 credits for new users
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    subscriptionPlan: "Free",
    monthlyRequestCount: 5,
    apiRequestCount: 0,
  });

  //Add the date the trial will end
  newUser.trialExpires = new Date(
    new Date().getTime() + (newUser.trialPeriod || 3) * 24 * 60 * 60 * 1000
  );

  //Save the user
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
//------Get User Profile (ensure correct credits for Free plan)------
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Fix: Always set 5 credits for Free plan
  if (user.subscriptionPlan === "Free" && user.monthlyRequestCount !== 5) {
    user.monthlyRequestCount = 5;
    await user.save();
  }
  res.status(200).json({ user });
});

//------Login---------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //check if password is valid
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //Generate token (jwt)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d", //token expires in 3 days
  });
  console.log(token);
  //set the token into cookie (http only)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  //send the response
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});
//------Logout-----
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});
//------Profile-----
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
//------Check user Auth Status-----
const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};