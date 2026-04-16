import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Job from './src/models/Job.js';
import Application from './src/models/Application.js';
import Notification from './src/models/Notification.js';

dotenv.config();

const diagnose = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const jobs = await Job.find().populate('recruiter', 'email');
    const apps = await Application.find().populate('job').populate('recruiter', 'email').populate('applicant', 'name');
    const notifs = await Notification.find().populate('recipient', 'email');
    
    console.log('--- ALL JOBS ---');
    jobs.forEach(j => console.log(`Job: ${j.title} | Recruiter: ${j.recruiter?.email}`));
    
    console.log('\n--- ALL RECRUITERS ---');
    const recruiters = await User.find({ role: 'recruiter' });
    recruiters.forEach(r => console.log(`Name: ${r.name} | Email: ${r.email} | DP: ${r.profilePicture}`));

    console.log('\n--- ALL SEEKERS ---');
    const seekers = await User.find({ role: 'job-seeker' });
    seekers.forEach(s => console.log(`Name: ${s.name} | Email: ${s.email} | DP: ${s.profilePicture}`));

    console.log('\n--- ALL APPLICATIONS ---');
    apps.forEach(a => console.log(`Job: ${a.job?.title} | Recruiter: ${a.recruiter?.email} | Applicant: ${a.applicant?.name}`));

    console.log('\n--- ALL NOTIFICATIONS ---');
    notifs.forEach(n => console.log(`Type: ${n.type} | To: ${n.recipient?.email} | Content: ${n.content}`));

    process.exit();
};
diagnose();
