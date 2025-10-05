const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const geminiRouter = require("./routes/geminiRouter");
const stripeRouter = require("./routes/stripeRouter");
const { errorHandler } = require("./middlewares/errorMiddleware");
const User = require("./models/User");
require("./utils/connectDB")();

const app = express();
// Ensure PORT is numeric to avoid string concatenation on increment
const PORT = Number(process.env.PORT) || 3000;

// Function to start server and handle port conflicts
const startServer = (port) => {
  // Normalize to number and validate range
  port = Number(port);
  if (!Number.isFinite(port) || port < 0 || port > 65535) {
    console.error('Failed to start server: Invalid port', port);
    return;
  }
  try {
    // Check required environment variables
    const baseRequired = ['JWT_SECRET', 'MONGO_URI'];
    const baseMissing = baseRequired.filter(v => !process.env[v]);
    if (baseMissing.length > 0) {
      throw new Error(`Missing required environment variables: ${baseMissing.join(', ')}`);
    }
    // At least one AI key must be present (GOOGLE_API_KEY or GROQ_API_KEY)
    if (!process.env.GOOGLE_API_KEY && !process.env.GROQ_API_KEY) {
      throw new Error('Missing AI provider key: set either GOOGLE_API_KEY or GROQ_API_KEY in .env');
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

//Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
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

//Cron for the Basic plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
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

//Cron for the Premium plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
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
//Cron paid plan

//----middlewares----
app.use(express.json()); //pass incoming json data
app.use(cookieParser()); //pass the cookie automatically
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:5174",
      "https://localhost:5175",
      "https://localhost:5176"
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
//----Routes-----
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/ai", geminiRouter);
app.use("/api/v1/stripe", stripeRouter);

//---Error handler middleware----
app.use(errorHandler);

//start the server
startServer(PORT);