import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Job from "./src/models/Job.js";

dotenv.config();

const users = [
    {
        name: "Admin User",
        email: "admin@gmail.com",
        password: "password123",
        role: "admin",
    },
    {
        name: "Recruiter One",
        email: "recruiter1@gmail.com",
        password: "password123",
        role: "recruiter",
        company: "Tech Corp",
    },
    {
        name: "Job Seeker One",
        email: "seeker1@gmail.com",
        password: "password123",
        role: "job-seeker",
    }
];

const jobs = [
    {
        title: "Frontend Developer",
        description: "Join our team to build amazing user interfaces using React and Tailwind CSS.",
        type: "full-time",
        location: "Bangalore, India",
        salary: { min: 800000, max: 1500000 },
        skills: ["React", "JavaScript", "Tailwind CSS", "Redux"],
        experience: "1-3 years",
        company: "Tech Corp",
        requirements: ["Strong knowledge of React", "Experience with CSS frameworks", "Good communication skills"],
    },
    {
        title: "Backend Engineer",
        description: "We are looking for a Node.js expert to handle our server-side logic and database management.",
        type: "remote",
        location: "Remote, India",
        salary: { min: 1000000, max: 2000000 },
        skills: ["Node.js", "Express", "MongoDB", "Socket.io"],
        experience: "3-5 years",
        company: "Cloud Solutions",
        requirements: ["Proficiency in Node.js", "Database optimization experience", "API design skills"],
    },
    {
        title: "UI/UX Designer",
        description: "Design intuitive and beautiful user journeys for our mobile and web applications.",
        type: "contract",
        location: "Mumbai, India",
        salary: { min: 500000, max: 800000 },
        skills: ["Figma", "Sketch", "Adobe XD"],
        experience: "1-2 years",
        company: "Creative Studio",
        requirements: ["Portfolio required", "Understanding of user behavior", "Creativity and innovation"],
    },
    {
        title: "Full Stack Intern",
        description: "Great opportunity for freshers to learn the E2E development process.",
        type: "internship",
        location: "Pune, India",
        salary: { min: 15000, max: 25000 },
        skills: ["MERN Stack", "HTML", "CSS"],
        experience: "Fresher",
        company: "StartUp Inc",
        requirements: ["Eagerness to learn", "Basic knowledge of JS", "Available for 6 months"],
    },
    {
        title: "Lead Quality Analyst",
        description: "Ensure the highest quality of our products through rigorous testing and automation.",
        type: "full-time",
        location: "Hyderabad, India",
        salary: { min: 1200000, max: 1800000 },
        skills: ["Selenium", "Python", "Manual Testing"],
        experience: "5+ years",
        company: "Safe Systems",
        requirements: ["Strong automation background", "Leadership experience", "Excellent attention to detail"],
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clean existing data
        await User.deleteMany();
        await Job.deleteMany();
        console.log("Existing data cleared.");

        // Insert users
        const createdUsers = await User.create(users);
        console.log(`${createdUsers.length} users created.`);

        const recruiter = createdUsers.find(u => u.role === "recruiter");

        // Insert jobs
        const jobsWithRecruiter = jobs.map(job => ({
            ...job,
            recruiter: recruiter._id
        }));

        const createdJobs = await Job.create(jobsWithRecruiter);
        console.log(`${createdJobs.length} jobs created.`);

        console.log("Data seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
