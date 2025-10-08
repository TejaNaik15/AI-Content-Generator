const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { openAIController, checkAIStatus } = require("../controllers/openAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

// Check AI service status (no auth required, helps diagnose issues)
openAIRouter.get("/status", checkAIStatus);

// Generate content (requires auth and checks request limits)
openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

module.exports = openAIRouter;