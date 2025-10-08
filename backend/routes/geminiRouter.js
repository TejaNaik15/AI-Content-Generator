const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { geminiController, checkGeminiStatus } = require("../controllers/geminiController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const geminiRouter = express.Router();

// Check Gemini API status (no auth required, helps diagnose issues)
geminiRouter.get("/status", checkGeminiStatus);

// Generate content (requires auth and checks request limits)
geminiRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  geminiController
);

module.exports = geminiRouter;