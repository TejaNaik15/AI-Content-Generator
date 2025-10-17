const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
const morgan = require('morgan');
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const geminiRouter = require("./routes/geminiRouter");
const stripeRouter = require("./routes/stripeRouter");
const { errorHandler } = require("./middlewares/errorMiddleware");
const User = require("./models/User");
require("./utils/connectDB")();

const app = express();
app.set('trust proxy', 1); 


app.use((req, res, next) => {
  try {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'https://ai-content-generator-woad-nine.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      if (req.method === 'OPTIONS') return res.sendStatus(204);
    }
  } catch (_) {}
  next();
});

const PORT = Number(process.env.PORT) || 3000;


const startServer = (port) => {
  
  port = Number(port);
  if (!Number.isFinite(port) || port < 0 || port > 65535) {
    console.error('Failed to start server: Invalid port', port);
    return;
  }
  try {
    
    const baseRequired = ['JWT_SECRET', 'MONGO_URI'];
    const baseMissing = baseRequired.filter(v => !process.env[v]);
    if (baseMissing.length > 0) {
      throw new Error(`Missing required environment variables: ${baseMissing.join(', ')}`);
    }
  
    if (!process.env.GOOGLE_API_KEY && !process.env.GROQ_API_KEY) {
      console.warn('Warning: No AI provider key set (GOOGLE_API_KEY or GROQ_API_KEY). AI features will be disabled.');
    }

    const server = app
      .listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Environment:', {
          nodeEnv: process.env.NODE_ENV || 'development',
          port: port,
          mongoUri: process.env.MONGO_URI,
          hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
          hasGroqApiKey: !!process.env.GROQ_API_KEY
        });
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          const nextPort = port + 1;
          if (nextPort > 65535) {
            console.error('No available ports below 65536. Stopping.');
            return;
          }
          console.log(`Port ${port} is busy, trying ${nextPort}...`);
          startServer(nextPort);
        } else {
          console.error('Server error:', err);
        }
      });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};


cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});


cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});


cron.schedule("0 0 1 * * *", async () => {
  try {
    
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.use(express.json()); 
app.use(cookieParser()); 
app.use(morgan('dev'));

const corsOptions = {
  origin: function(origin, callback) {
    const staticAllowed = [
      
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
      "http://127.0.0.1:5176",
  
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:5174",
      "https://localhost:5175",
      "https://localhost:5176",
    
      "https://ai-content-generator-woad-nine.vercel.app"
    ];

    const allowedHostnames = new Set([
      'localhost',
      '127.0.0.1',
      'ai-content-generator-woad-nine.vercel.app',
    ]);

    
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      try {
        allowedHostnames.add(new URL(frontendUrl).hostname);
      } catch (e) {
        console.warn('Invalid FRONTEND_URL in env:', frontendUrl);
      }
    }

    const wildcardHostnames = [
      /(^|\.)vercel\.app$/i,
      /(^|\.)onrender\.com$/i,
    ];


    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    let hostname = '';
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {
      return callback(new Error('Invalid origin: ' + origin));
    }

    if (
      staticAllowed.includes(origin) ||
      allowedHostnames.has(hostname) ||
      wildcardHostnames.some((re) => re.test(hostname))
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    
    return res.sendStatus(204);
  }
  next();
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/ai", geminiRouter);
app.use("/api/v1/stripe", stripeRouter);


app.use(errorHandler);


startServer(PORT);
