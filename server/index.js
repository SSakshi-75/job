
    import express from "express";
    import { config } from "dotenv";
    import compression from "compression";
    import cookieParser from "cookie-parser";
    import Db from "./src/database/Db.js";
    import cors from "cors";
    import morgan from "morgan";
    import cluster from "cluster";
    import os from "os";

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

    Db().then(() => {
      app.listen(PORT, () =>
        console.log("🚀 Server running at http://localhost:" + PORT)
      );
    });

    }
    