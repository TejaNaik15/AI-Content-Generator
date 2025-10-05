const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

//----Gemini AI Controller----

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Validate Gemini API key
const validateGeminiKey = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    await result.response.text();
    return { valid: true };
  } catch (error) {
    if (error.message?.includes("API key")) {
      return { valid: false, reason: "Invalid API key" };
    }
    if (error.message?.includes("quota")) {
      return { valid: false, reason: "Quota exceeded" };
    }
    return { valid: false, reason: error.message };
  }
};

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  
  // Verify user and their subscription status
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Double check the request limit
  if (user.apiRequestCount >= user.monthlyRequestCount) {
    return res.status(429).json({
      message: "API Request limit reached",
      currentCount: user.apiRequestCount,
      limit: user.monthlyRequestCount,
      plan: user.subscriptionPlan
    });
  }

  try {
    // Validate Gemini key before making the main request
    const keyStatus = await validateGeminiKey();
    if (!keyStatus.valid) {
      return res.status(503).json({
        message: "AI service unavailable",
        reason: keyStatus.reason,
        suggestion: keyStatus.reason === "Quota exceeded" 
          ? "The API key's quota has been exceeded. Please contact support or try again later."
          : "There was an error with the AI service. Please try again later."
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const content = await result.response.text();
    
    if (!content) {
      return res.status(500).json({ message: "No content generated from AI service" });
    }

    // Create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
      prompt,
    });

    // Update user's history and request count
    user.contentHistory.push(newContent?._id);
    user.apiRequestCount += 1;
    await user.save();

    // Send response with additional info
    res.status(200).json({
      content,
      requestsRemaining: user.monthlyRequestCount - user.apiRequestCount,
      totalRequests: user.monthlyRequestCount,
      plan: user.subscriptionPlan
    });
    
  } catch (error) {
    console.error("AI service error:", error);
    
    // Handle specific error cases
    if (error.message?.includes("quota")) {
      return res.status(503).json({
        message: "AI service temporarily unavailable",
        reason: "API quota exceeded",
        suggestion: "The API key's quota has been exceeded. Please try again later or contact support."
      });
    }
    
    if (error.message?.includes("API key")) {
      return res.status(503).json({
        message: "AI service unavailable",
        reason: "Invalid API key",
        suggestion: "There was an authentication error with the AI service. Please try again later."
      });
    }

    res.status(500).json({
      message: "Failed to generate content",
      reason: error.message,
      suggestion: "Please try again. If the problem persists, contact support."
    });
  }
});

// Add an endpoint to check AI service status
const checkAIStatus = asyncHandler(async (req, res) => {
  const status = await validateGeminiKey();
  res.json({
    available: status.valid,
    reason: status.reason
  });
});

module.exports = {
  openAIController,
  checkAIStatus
};