import { config } from "dotenv";
config();

import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route files
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow all for simplicity during debug if needed, or specific
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: true, 
  credentials: true 
}));

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Health check for Vercel
app.get("/api/health", (req, res) => res.status(200).json({ 
  status: "ok", 
  message: "Server is online",
  timestamp: new Date().toISOString()
}));

app.get("/", (req, res) => {
  res.send("Welcome to Smart Job Portal API (running on Vercel)");
});

// Database connection middleware for Serverless environment
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error("❌ Request blocked due to DB error:", error.message);
      res.status(500).json({ success: false, message: "Database connection failed" });
    }
  } else {
    next();
  }
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interviews", interviewRoutes);

// Initialize DB connection and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Local server startup
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      app.listen(PORT, () =>
        console.log("🚀 Server running at http://localhost:" + PORT)
      );
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

// Export for Vercel
export default app;