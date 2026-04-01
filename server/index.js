
    import express from "express";
    import { config } from "dotenv";
    import compression from "compression";
    import cookieParser from "cookie-parser";
    import connectDB from "./src/config/db.js";
    import cors from "cors";
    import morgan from "morgan";
    import cluster from "cluster";
    import os from "os";

    // Route files
    import authRoutes from "./src/routes/authRoutes.js";

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

    app.use(cors({ origin: "*", credentials: true }));
    
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("Welcome to Auto Generated Backend!");
    });

    // Mount routers
    app.use("/api/auth", authRoutes);

    connectDB().then(() => {
      app.listen(PORT, () =>
        console.log("🚀 Server running at http://localhost:" + PORT)
      );
    });

    }
    