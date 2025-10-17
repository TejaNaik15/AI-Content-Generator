const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let requestLimit = user?.monthlyRequestCount || 0;
  
  
  if (user?.apiRequestCount >= requestLimit) {
    return res.status(429).json({ 
      message: "API Request limit reached",
      currentCount: user.apiRequestCount,
      limit: requestLimit,
      plan: user.subscriptionPlan
    });
  }

  
  next();
});

module.exports = checkApiRequestLimit;
