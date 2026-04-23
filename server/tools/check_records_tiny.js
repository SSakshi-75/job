import mongoose from "mongoose";
import { config } from "dotenv";
import Job from "../src/models/Job.js";
import Application from "../src/models/Application.js";
import Notification from "../src/models/Notification.js";

config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const latestApp = await Application.findOne().sort({ createdAt: -1 });
        if (latestApp) {
            console.log("APP_REC_ID:" + latestApp.recruiter);
            const job = await Job.findById(latestApp.job);
            console.log("JOB_REC_ID:" + job?.recruiter);
        }

        const latestNotif = await Notification.findOne().sort({ createdAt: -1 });
        if (latestNotif) {
            console.log("NOTIF_REC_ID:" + latestNotif.recipient);
        }

        process.exit();
    } catch (err) {
        process.exit(1);
    }
}
check();
