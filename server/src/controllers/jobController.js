import Job from "../models/Job.js";
import User from "../models/User.js";
import { getJobRecommendations, analyzeResume } from "../services/aiService.js";

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
export const createJob = async (req, res) => {
    try {
        const recruiter = await User.findById(req.user._id);

        const job = await Job.create({
            ...req.body,
            recruiter: req.user._id,
            company: req.body.company || recruiter.company || "Unknown Company",
            companyLogo: recruiter.companyLogo || "",
        });

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const { keyword, location, type, minSalary, maxSalary, skills, page = 1, limit = 10 } = req.query;

        const query = { status: "active" };

        // Keyword search on title & description
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Job type filter
        if (type) {
            query.type = type;
        }

        // Salary range filter
        if (minSalary || maxSalary) {
            query["salary.min"] = { $gte: Number(minSalary) || 0 };
            if (maxSalary) query["salary.max"] = { $lte: Number(maxSalary) };
        }

        // Skills filter (match any)
        if (skills) {
            const skillsArr = skills.split(",").map(s => s.trim());
            query.skills = { $in: skillsArr.map(s => new RegExp(s, "i")) };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate("recruiter", "name email company")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Job.countDocuments(query),
        ]);

        // Force Logo Fallback for Top Brands on every request
        const topBrandLogos = {
            "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
            "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            "Tesla": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
            "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            "Spotify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
            "Sportify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg", // Handle typo
            "SpaceX": "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg",
            "Cloud Solutions": "https://cdn-icons-png.flaticon.com/512/5968/5968267.png",
            "Creative Studio": "https://cdn-icons-png.flaticon.com/512/3659/3659030.png",
            "StartUp Inc": "https://cdn-icons-png.flaticon.com/512/261/261768.png"
        };

        const enrichedJobs = jobs.map(job => {
            const jobObj = job.toObject();
            return {
                ...jobObj,
                companyLogo: jobObj.companyLogo || topBrandLogos[jobObj.company] || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            };
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            data: enrichedJobs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("recruiter", "name email company companyWebsite");

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get jobs posted by logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter - owner only)
export const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Make sure user is the job owner
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this job" });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter - owner or Admin)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Allow owner or admin
        if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get AI recommended jobs
// @route   GET /api/jobs/ai/recommendations
// @access  Private (Job Seeker)
export const getAIRecommendedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const allJobs = await Job.find({ status: "active" }).populate("recruiter", "name email company");
        
        const recommendations = getJobRecommendations(user, allJobs);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// @desc    Analyze match for a specific job
// @route   GET /api/jobs/:id/ai/analyze
// @access  Private (Job Seeker)
export const analyzeSpecificJobMatch = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        let userSkills = user.profile?.skills || user.skills || [];
        
        // Extract skills from resume context dynamically
        if (user.resume) {
            const { PDFParse } = require("pdf-parse");
            const relativePath = user.resume.startsWith("/") ? user.resume.substring(1) : user.resume;
            const fullPath = path.join(process.cwd(), "public", relativePath);
            
            if (fs.existsSync(fullPath)) {
                try {
                    const dataBuffer = fs.readFileSync(fullPath);
                    const parser = new PDFParse({ data: dataBuffer });
                    const pdfData = await parser.getText();
                    const resumeText = pdfData.text || "";
                    await parser.destroy();
                    
                    // Simple extraction of job skills found in resume
                    if (job.skills && Array.isArray(job.skills)) {
                        job.skills.forEach(skill => {
                            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');
                            const regex = new RegExp(`(^|\\W)(${escapedSkill})(\\W|$)`, 'i');
                            if (regex.test(resumeText) && !userSkills.includes(skill)) {
                                userSkills.push(skill);
                            }
                        });
                    }
                } catch (err) {
                    console.error("PDF parse error in job match:", err);
                }
            }
        }

        const analysis = analyzeResume(userSkills, job.title, job.skills);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
