import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import cors from "cors";
import morgan from "morgan";
// Route files
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";

config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean), 
  credentials: true 
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Database middleware
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGO_URI) await connectDB();
    next();
  } catch (err) {
    console.error("DB Middleware Error:", err);
    next();
  }
});

app.use(express.static("public"));

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("Welcome to Smart Job Portal API!");
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interviews", interviewRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok", env: process.env.NODE_ENV }));

// Local server startup
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log("🚀 Server running at http://localhost:" + PORT)
  );
}

export default app;