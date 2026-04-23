import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../src/models/User.js";
import Job from "../src/models/Job.js";

config();

const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png", location: "Mountain View, CA", industry: "Tech & Search" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", location: "Redmond, WA", industry: "Software" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg", location: "Austin, TX", industry: "Automotive/AI" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", location: "Los Gatos, CA", industry: "Entertainment" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg", location: "Stockholm, Sweden", industry: "Music Streaming" },
    { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg", location: "Boca Chica, TX", industry: "Aerospace" }
];

const jobs = [
    { title: "Senior AI Researcher", type: "full-time", experience: "5+ Years", salary: { min: 1500000, max: 3500000 }, skills: ["PyTorch", "TensorFlow", "Generative AI"] },
    { title: "Cloud Infrastructure Architect", type: "full-time", experience: "8+ Years", salary: { min: 2500000, max: 4500000 }, skills: ["Azure", "Kubernetes", "DevOps"] },
    { title: "Autonomous Systems Engineer", type: "full-time", experience: "3-5 Years", salary: { min: 1800000, max: 2800000 }, skills: ["C++", "Robotics", "Computer Vision"] },
    { title: "Lead Content Engineer", type: "remote", experience: "4+ Years", salary: { min: 1200000, max: 2200000 }, skills: ["Video Processing", "React", "AWS"] },
    { title: "Algorithms Strategist", type: "full-time", experience: "2-4 Years", salary: { min: 1400000, max: 2400000 }, skills: ["Machine Learning", "Python", "Data Science"] },
    { title: "Rocket Platform Developer", type: "full-time", experience: "6+ Years", salary: { min: 2000000, max: 4000000 }, skills: ["Rust", "Embedded C", "Safety Systems"] }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database...");

        // Create a dummy recruiter for each top company
        for (let i = 0; i < companies.length; i++) {
            const comp = companies[i];
            const jobData = jobs[i];

            let recruiter = await User.findOne({ email: `${comp.name.toLowerCase()}@career.com` });
            
            if (!recruiter) {
                recruiter = await User.create({
                    name: `${comp.name} Hiring Team`,
                    email: `${comp.name.toLowerCase()}@career.com`,
                    password: "password123",
                    role: "recruiter",
                    company: comp.name,
                    companyLogo: comp.logo,
                    location: comp.location,
                });
                // Note: industry is not in schema but it's handled in aggregation via recruiterInfo.industry
            }

            // Add unique jobs for this company
            await Job.create({
                ...jobData,
                description: `Join ${comp.name} as a ${jobData.title} and lead the next wave of innovation. We are looking for highly motivated individuals who can handle ${jobData.skills.join(", ")} at scale.`,
                company: comp.name,
                companyLogo: comp.logo,
                location: comp.location,
                recruiter: recruiter._id,
                status: "active"
            });

            console.log(`Added ${jobData.title} for ${comp.name}`);
        }

        console.log("Seeding complete! Refresh your Browse Companies page.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
