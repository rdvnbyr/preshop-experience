require("dotenv").config();

const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 0.1,
  sendDefaultPii: true,
  // profileSampleRate: 0.1,
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { randomUUID } = require("node:crypto");

// Initialize Logger
const { 
  setupLogger, 
  overrideGlobalConsole, 
  systemLogger,
  LogLevel
} = require("@exp-places-app/logger");

// Setup logger configuration
setupLogger({
  level: process.env.LOG_LEVEL || LogLevel.INFO,
  environment: process.env.NODE_ENV || 'development',
  enableFileLogging: true,
  logDir: './logs'
});

// Override console for seamless migration
overrideGlobalConsole();

// Initialize app
const app = express();

app.use((req, res, next) => {
  const scope = Sentry.getCurrentScope();
  scope.setTag("route", req.path);
  scope.setContext("request", {
    method: req.method,
    url: req.originalUrl || req.url,
    ua: req.headers["user-agent"],
    ip: req.ip,
    query: req.query,
  });
  next();
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const swRoutes = require("./routes/swRoutes");

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/places/:placeId/reviews", reviewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/sw", swRoutes);

// 404 handler
app.use((req, res) => {
  const err = new Error("Route not found!");
  err.status = 404;
  err.name = "RouteNotFoundError";
  err.request = req;
  Sentry.captureException(err);
  console.log(err);
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: err,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  Sentry.captureException(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
    errorStack: JSON.stringify(err.stack),
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  systemLogger.get().info('Server started successfully', { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
