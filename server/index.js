
    import express from "express";
    import { config } from "dotenv";
    import compression from "compression";
    import cookieParser from "cookie-parser";
    import connectDB from "./src/config/db.js";
    import cors from "cors";
    import morgan from "morgan";
    import cluster from "cluster";
    import os from "os";
    import { createServer } from "http";

    // Route files
    import authRoutes from "./src/routes/authRoutes.js";
    import userRoutes from "./src/routes/userRoutes.js";
    import jobRoutes from "./src/routes/jobRoutes.js";
    import applicationRoutes from "./src/routes/applicationRoutes.js";
    import adminRoutes from "./src/routes/adminRoutes.js";
    import chatRoutes from "./src/routes/chatRoutes.js";
    import { initSocket } from "./src/socket/index.js";

    config();

    const PORT = process.env.PORT || 5000;
    const numCPUs = os.cpus().length;

    if (cluster.isPrimary) {
      console.log("Master process running:", process.pid);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker) => {
        console.log("Worker died:", worker.process.pid);
        cluster.fork();
      });

    } else {

    const app = express();
    const httpServer = createServer(app);
    const io = initSocket(httpServer);
    app.set('io', io);

    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(express.static("public"));

    app.get("/", (req, res) => {
      res.send("Welcome to Smart Job Portal API!");
    });

    // Mount routers
    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/applications", applicationRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/chats", chatRoutes);

    connectDB().then(() => {
      httpServer.listen(PORT, () =>
        console.log("🚀 Server running at http://localhost:" + PORT)
      );
    });

    }
    