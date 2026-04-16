import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Job from './src/models/Job.js';
import Application from './src/models/Application.js';

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const recruiters = await User.find({ role: 'recruiter' });
    for (const r of recruiters) {
        const jobs = await Job.find({ recruiter: r._id });
        const apps = await Application.find({ recruiter: r._id });
        console.log(`Recruiter: ${r.name} (${r.email}) [ID: ${r._id}]`);
        console.log(`  Jobs posted: ${jobs.length}`);
        console.log(`  Applications received: ${apps.length}`);
        jobs.forEach(j => {
            console.log(`    Job: ${j.title} [id: ${j._id}] | applicantsCount fix: ${j.applicantsCount}`);
        });
    }
    process.exit();
};
run();
