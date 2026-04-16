import mongoose from "mongoose";
import { config } from "dotenv";
import Job from "../src/models/Job.js";
import User from "../src/models/User.js";

config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const shivam = await User.findOne({ name: /shivam/i });
        const anshu = await User.findOne({ name: /anshu/i });

        console.log("SHIVAM_ID:" + (shivam ? shivam._id : "NOT_FOUND"));
        console.log("ANSHU_ID:" + (anshu ? anshu._id : "NOT_FOUND"));

        if (anshu) {
            const anshuJobs = await Job.find({ recruiter: anshu._id });
            console.log("ANSHU_JOBS_COUNT:" + anshuJobs.length);
            if (anshuJobs.length > 0) {
                console.log("ANSHU_FIRST_JOB_ID:" + anshuJobs[0]._id);
            }
        }

        process.exit();
    } catch (err) {
        process.exit(1);
    }
}
debug();
