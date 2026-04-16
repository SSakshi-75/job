import mongoose from "mongoose";
import { config } from "dotenv";
import fs from "fs";
import Job from "./src/models/Job.js";
import Application from "./src/models/Application.js";
import User from "./src/models/User.js";

config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, "name email role");
        const jobs = await Job.find({});
        const applications = await Application.find({});
        
        const data = {
            users,
            jobs: jobs.map(j => ({ id: j._id, title: j.title, recruiter: j.recruiter })),
            apps: applications.map(a => ({ id: a._id, job: a.job, recruiter: a.recruiter, applicant: a.applicant }))
        };
        
        fs.writeFileSync("check_results.json", JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
