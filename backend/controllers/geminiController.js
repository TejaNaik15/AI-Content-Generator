const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

// Initialize Gemini API with error handling
let genAI;
let isInitialized = false;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

const initializeGeminiAPI = () => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not set in environment variables');
      return false;
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    return false;
  }
};

// Try to initialize on startup
initializeGeminiAPI();

// Validate AI readiness without consuming quota (supports Gemini or Groq)
const validateGeminiAccess = async () => {
  try {
    // If Groq key exists, consider service available (we'll catch runtime errors separately)
    if (process.env.GROQ_API_KEY) {
      return { valid: true };
    }
    // Otherwise require Google key and basic Gemini init
    if (!process.env.GOOGLE_API_KEY) {
      return { valid: false, reason: "Missing GOOGLE_API_KEY" };
    }
    // Try to initialize if not already initialized
    if (!isInitialized && !initializeGeminiAPI()) {
      return { valid: false, reason: "AI service initialization failed" };
    }
    if (!genAI) {
      return { valid: false, reason: "AI service not properly initialized" };
    }
    return { valid: true };
  } catch (error) {
    console.error('Gemini API validation error:', error);
    return { valid: false, reason: error.message || 'Validation error' };
  }
};

const geminiController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  // Validate prompt early to avoid unnecessary processing and 500s
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      message: "Invalid request",
      reason: "'prompt' is required and must be a non-empty string"
    });
  }
  
  // Verify user and their subscription status
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check request limit
  if (user.apiRequestCount >= user.monthlyRequestCount) {
    return res.status(429).json({
      message: "API Request limit reached",
      currentCount: user.apiRequestCount,
      limit: user.monthlyRequestCount,
      plan: user.subscriptionPlan
    });
  }

  // Validate Gemini access before making the main request (lightweight)
  const accessStatus = await validateGeminiAccess();
  if (!accessStatus.valid) {
    return res.status(503).json({
      message: "AI service unavailable",
      reason: accessStatus.reason,
      suggestion: "There was an error accessing the AI service. Please check your API key and try again later."
    });
  }

  try {
    // Try to initialize Gemini only if we are not using Groq
    const usingGroq = !!process.env.GROQ_API_KEY;
    if (!usingGroq) {
      if (!isInitialized && !initializeGeminiAPI()) {
        return res.status(503).json({
          message: "AI service unavailable",
          suggestion: "Please try again later or contact support"
        });
      }
    }

    // Timeout guard
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI service timeout')), 30000);
    });

    // If GROQ_API_KEY is present, use Groq provider
    const useGroq = !!process.env.GROQ_API_KEY;

    const groqGenerate = async () => {
      const apiKey = process.env.GROQ_API_KEY;
      const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes concise, high-quality content.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`Groq API error ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content || '';
      if (!text || !text.trim()) throw new Error('Empty content generated');
      return text.trim();
    };

    const geminiGenerate = async () => {
      const preferredModel = GEMINI_MODEL;
      const fallbackModel = 'gemini-1.5-flash';
      const buildModel = (name) => genAI.getGenerativeModel({
        model: name,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      const tryOnce = async (name) => {
        const model = buildModel(name);
        const result = await model.generateContent(prompt);
        if (!result.response) throw new Error('Empty response from AI service');
        const text = await result.response.text();
        if (!text || !text.trim()) throw new Error('Empty content generated');
        return text.trim();
      };
      try {
        return await tryOnce(preferredModel);
      } catch (err) {
        const msg = String(err?.message || '').toLowerCase();
        const unavailable = msg.includes('not available') || msg.includes('not found') || msg.includes('unsupported') || msg.includes('permission');
        if (unavailable && fallbackModel && fallbackModel !== preferredModel) {
          console.warn(`Preferred model '${preferredModel}' failed (${err.message}). Falling back to '${fallbackModel}'.`);
          return await tryOnce(fallbackModel);
        }
        throw err;
      }
    };

    const content = await Promise.race([
      useGroq ? groqGenerate() : geminiGenerate(),
      timeoutPromise
    ]);

    if (!content) {
      return res.status(500).json({ message: "No content generated" });
    }

    try {
      const newContent = await ContentHistory.create({
        user: req?.user?._id,
        content,
        prompt,
      });

      if (!Array.isArray(user.contentHistory)) {
        user.contentHistory = [];
      }
      user.contentHistory.push(newContent?._id);
      user.apiRequestCount = Number(user.apiRequestCount || 0) + 1;
      await user.save();

      return res.status(200).json({
        content,
        requestsRemaining: user.monthlyRequestCount - user.apiRequestCount,
        totalRequests: user.monthlyRequestCount,
        plan: user.subscriptionPlan
      });
    } catch (dbErr) {
      console.error('Database update error:', dbErr);
      return res.status(200).json({
        content,
        requestsRemaining: user.monthlyRequestCount - user.apiRequestCount,
        totalRequests: user.monthlyRequestCount,
        plan: user.subscriptionPlan,
        warning: "Content was generated but couldn't be saved to history"
      });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    const msg = String(error?.message || '').toLowerCase();
    if (msg.includes('quota') || msg.includes('resource_exhausted')) {
      return res.status(503).json({
        message: "AI service temporarily unavailable",
        reason: "API quota exceeded",
        suggestion: "The API quota has been exceeded. Please try again later."
      });
    }
    if (msg.includes('permission') || msg.includes('permissiondenied')) {
      const usingGroq = !!process.env.GROQ_API_KEY;
      return res.status(503).json({
        message: "AI service unavailable",
        reason: "Insufficient permissions for the requested model",
        suggestion: usingGroq
          ? "Switch to 'llama-3.1-8b-instant' or 'llama-3.1-70b-versatile', or grant access to the configured Groq model."
          : "Switch to 'gemini-1.5-flash' or grant access to the configured Gemini model."
      });
    }
    if (msg.includes('not found') || msg.includes('model not found')) {
      const usingGroq = !!process.env.GROQ_API_KEY;
      return res.status(503).json({
        message: "AI service unavailable",
        reason: "Requested model not available",
        suggestion: usingGroq
          ? "Use 'llama-3.1-8b-instant' or 'llama-3.1-70b-versatile', or set GROQ_MODEL to a valid model."
          : "Use 'gemini-1.5-flash' or set GEMINI_MODEL to a valid available model."
      });
    }
    if (msg.includes('safety') || msg.includes('blocked')) {
      return res.status(422).json({
        message: "Prompt blocked by safety settings",
        reason: error.message,
        suggestion: "Rephrase the prompt to be less sensitive or specific."
      });
    }
    if (msg.includes('invalid api key') || msg.includes('unauthorized') || msg.includes('401')) {
      return res.status(503).json({
        message: "AI service unauthorized",
        reason: "Invalid or unauthorized API key",
        suggestion: "Verify GOOGLE_API_KEY and project API access."
      });
    }
    if (msg.includes('request payload') && msg.includes('too large')) {
      return res.status(413).json({
        message: "Request too large",
        reason: error.message,
        suggestion: "Shorten the prompt or reduce attachments."
      });
    }
    if (msg.includes('deadline exceeded') || msg.includes('timeout')) {
      return res.status(504).json({
        message: "AI service timeout",
        reason: error.message,
        suggestion: "Try again in a moment or simplify the prompt."
      });
    }

    const asString = String(error);
    if (asString.includes('GoogleGenerativeAI')) {
      const base = {
        message: "AI service error",
        reason: error.message || asString,
        suggestion: "Verify model access, API key validity, and retry."
      };
      if ((process.env.NODE_ENV || 'development') === 'development') {
        return res.status(503).json({
          ...base,
          details: {
            name: error.name,
            code: error.code,
            status: error.status,
          }
        });
      }
      return res.status(503).json(base);
    }

    return res.status(500).json({
      message: "Failed to generate content",
      reason: error.message,
      suggestion: "Please try again. If the problem persists, contact support."
    });
  }
});

// Add endpoint to check AI service status
const checkGeminiStatus = asyncHandler(async (req, res) => {
  const status = await validateGeminiAccess();
  const usingGroq = !!process.env.GROQ_API_KEY;
  res.json({
    available: status.valid,
    reason: status.reason,
    provider: usingGroq ? 'groq' : 'gemini',
    model: usingGroq ? (process.env.GROQ_MODEL || 'llama-3.1-8b-instant') : (process.env.GEMINI_MODEL || 'gemini-1.5-pro')
  });
});

module.exports = {
  geminiController,
  checkGeminiStatus
};