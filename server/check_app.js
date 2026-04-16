import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './src/models/Job.js';
import Application from './src/models/Application.js';
import User from './src/models/User.js';

dotenv.config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const app = await Application.findOne().populate('job').populate('applicant').populate('recruiter');
    if (app) {
        console.log('--- FOUND APPLICATION ---');
        console.log('App ID:', app._id);
        console.log('Job Title:', app.job?.title);
        console.log('Job Recruiter Field:', app.job?.recruiter);
        console.log('Application Recruiter Field:', app.recruiter?._id, `(${app.recruiter?.email})`);
        console.log('Applicant:', app.applicant?.name, `(${app.applicant?.email})`);
        console.log('App Status:', app.status);
    } else {
        console.log('No applications found.');
    }
    const currentRecruiter = await User.findOne({ role: 'recruiter' });
    console.log('\n--- FIRST RECRUITER IN DB ---');
    console.log(`${currentRecruiter?._id}: ${currentRecruiter?.name} (${currentRecruiter?.email})`);
    
    process.exit();
};
check();
