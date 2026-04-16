import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    requirements: [String],
    type: { type: String, enum: ["full-time", "part-time", "remote", "internship", "contract"] },
    location: String,
    salary: { min: Number, max: Number, currency: String },
    skills: [String],
    experience: String,
    openings: Number,
    status: { type: String, default: "active" },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: String,
    companyLogo: String,
    applicantsCount: { type: Number, default: 0 },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
const User = mongoose.model("User", new mongoose.Schema({ name: String }));

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Find any recruiter to use as recruiter field
    const anyRecruiter = await User.findOne();
    if (!anyRecruiter) {
        console.log("No user found. Cannot seed.");
        process.exit(1);
    }

    const fakeJobs = [
        {
            title: "Easy Money - Work From Home Guaranteed",
            description: "Earn easy money from home. No experience required. Just click link and start earning. WhatsApp us now!",
            requirements: ["No experience required", "Just a phone"],
            type: "remote",
            location: "Anywhere",
            salary: { min: 10000, max: 10000000, currency: "INR" },
            skills: ["None"],
            experience: "0",
            openings: 100,
            status: "active",
            recruiter: anyRecruiter._id,
            company: "Quick Cash Corp",
            companyLogo: "",
            applicantsCount: 0,
        },
        {
            title: "Crypto Investment Manager - Urgent",
            description: "Investment opportunity in crypto. Pay first to get started. Guaranteed returns. Contact on Telegram.",
            requirements: ["Pay registration fee", "No skills needed"],
            type: "remote",
            location: "Online",
            salary: { min: 0, max: 50000000, currency: "INR" },
            skills: ["crypto", "investment"],
            experience: "0",
            openings: 500,
            status: "active",
            recruiter: anyRecruiter._id,
            company: "CryptoEarn Ltd",
            companyLogo: "",
            applicantsCount: 0,
        },
    ];

    const result = await Job.insertMany(fakeJobs);
    console.log(`✅ Seeded ${result.length} fake jobs for demo!`);
    result.forEach(j => console.log(`  - ${j.title} (${j._id})`));
    
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
