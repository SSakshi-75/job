import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a job title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please add a job description"],
    },
    requirements: {
        type: [String],
        default: [],
    },
    type: {
        type: String,
        enum: ["full-time", "part-time", "remote", "internship", "contract"],
        required: [true, "Please specify the job type"],
    },
    location: {
        type: String,
        required: [true, "Please add a location"],
    },
    salary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: String,
        default: "0",
    },
    openings: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ["active", "closed", "draft"],
        default: "active",
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: String,
        required: [true, "Please add a company name"],
    },
    companyLogo: {
        type: String,
        default: "",
    },
    applicantsCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Index for search
jobSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
