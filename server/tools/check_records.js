import mongoose from "mongoose";
import { config } from "dotenv";
import Job from "../src/models/Job.js";
import Application from "../src/models/Application.js";
import Notification from "../src/models/Notification.js";

config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const latestApp = await Application.findOne().sort({ createdAt: -1 });
        console.log("\n--- LATEST APPLICATION ---");
        if (latestApp) {
            console.log(`ID: ${latestApp._id}`);
            console.log(`Job ID: ${latestApp.job}`);
            console.log(`Applicant ID: ${latestApp.applicant}`);
            console.log(`Recruiter ID: ${latestApp.recruiter}`);
            console.log(`Created At: ${latestApp.createdAt}`);

            const job = await Job.findById(latestApp.job);
            console.log(`\nOriginal Job Recruiter: ${job?.recruiter}`);
        } else {
            console.log("No applications found.");
        }

        const latestNotif = await Notification.findOne().sort({ createdAt: -1 });
        console.log("\n--- LATEST NOTIFICATION ---");
        if (latestNotif) {
            console.log(`Recipient (Recruiter): ${latestNotif.recipient}`);
            console.log(`Sender (Applicant): ${latestNotif.sender}`);
            console.log(`Content: ${latestNotif.content}`);
            console.log(`Type: ${latestNotif.type}`);
        } else {
            console.log("No notifications found.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
