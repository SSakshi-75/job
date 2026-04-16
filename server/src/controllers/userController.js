import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import fs from "fs";
import path from "path";

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name", "phone", "bio", "skills", "experience",
            "education", "location", "company", "companyWebsite",
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // Handle skills as array (comma-separated string from frontend)
        if (typeof updates.skills === "string") {
            updates.skills = updates.skills.split(",").map(s => s.trim()).filter(Boolean);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload profile picture
// @route   POST /api/user/upload-profile-pic
// @access  Private
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        }

        const filePath = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: filePath },
            { new: true }
        );

        res.status(200).json({ success: true, data: user, filePath });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload resume (PDF)
// @route   POST /api/user/upload-resume
// @access  Private
export const uploadUserResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a PDF file" });
        }

        const filePath = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { resume: filePath },
            { new: true }
        );

        console.log(`Resume uploaded successfully for user: ${user.name} (${user._id})`);

        res.status(200).json({ success: true, data: user, filePath });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all notifications for current user
// @route   GET /api/user/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("sender", "name profilePicture")
            .populate("job", "title")
            .populate("application", "status");

        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clear all notifications for current user
// @route   DELETE /api/user/notifications
// @access  Private
export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user.id });
        res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Analyze user resume using AI (actually parses PDF content)
// @route   POST /api/user/analyze-resume
// @access  Private
export const analyzeUserResume = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let resumeText = "";
        let analysisType = "profile";

        // Try to parse PDF resume if it exists
        if (user.resume) {
            // Fix: ensure user.resume doesn't have a leading slash when joining if it's meant to be relative to 'public'
            const relativePath = user.resume.startsWith("/") ? user.resume.substring(1) : user.resume;
            const fullPath = path.join(process.cwd(), "public", relativePath);
            
            console.log(`Analyzing file at: ${fullPath}`);

            if (fs.existsSync(fullPath)) {
                try {
                    const dataBuffer = fs.readFileSync(fullPath);
                    const parser = new PDFParse({ data: dataBuffer });
                    const pdfData = await parser.getText();
                    resumeText = pdfData.text || "";
                    await parser.destroy();
                    analysisType = "resume";
                    console.log(`Parsed resume text length: ${resumeText.length} characters`);
                } catch (pdfErr) {
                    console.error("PDF Parsing Error during analysis:", pdfErr);
                }
            } else {
                console.error(`Resume file not found on disk: ${fullPath}`);
            }
        }

        // Expanded set of skills
        const commonSkills = [
            "React", "Angular", "Vue", "Next.js", "Javascript", "TypeScript", "HTML", "CSS", "Tailwind",
            "Node.js", "Express", "Python", "Django", "Flask", "Java", "Spring Boot", "Go", "PHP", "Laravel",
            "MongoDB", "PostgreSQL", "MySQL", "Redis", "SQL", "Firebase",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "CI/CD", "Jenkins",
            "Data Structure", "Algorithms", "System Design", "REST APIs", "GraphQL", "Microservices",
            "Unit Testing", "Jest", "TDD", "UX/UI Design", "Agile", "Scrum", "Redux", "Context API"
        ];

        const profileSkills = user.skills || [];
        const combinedText = (resumeText + " " + profileSkills.join(" ")).toLowerCase();
        
        const matched = commonSkills.filter(skill => {
            // Escape regex special characters and use word boundaries/non-word boundaries
            // to prevent false positives like 'go' matching 'good', or 'css' matching 'success'
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');
            const regex = new RegExp(`(^|\\W)(${escapedSkill})(\\W|$)`, 'i');
            return regex.test(combinedText);
        });

        console.log(`Matched Skills: ${matched.join(", ")}`);

        const missing = commonSkills
            .filter(skill => !matched.some(m => m.toLowerCase() === skill.toLowerCase()))
            .filter(skill => ["React", "Node.js", "TypeScript", "AWS", "Docker", "SQL", "Git", "System Design"].includes(skill))
            .filter(skill => !matched.includes(skill));

        // Refined Scoring: More realistic and dynamic distribution
        let score = 0; 
        
        // Base structural score
        if (analysisType === "resume" && resumeText.length > 50) score += 20; 
        if (profileSkills.length > 0) score += 10;
        
        // Content volume evaluate
        let contentBonus = 0;
        if (analysisType === "resume") {
            const wordCount = resumeText.trim().split(/\s+/).length;
            if (wordCount > 600) contentBonus = 20;
            else if (wordCount > 300) contentBonus = 15;
            else if (wordCount > 150) contentBonus = 10;
        }

        // Skill Matching Score (Scaling up to 15 skills for max bonus)
        const maxExpectedSkills = 15;
        const skillMatchBonus = Math.min(50, Math.round((matched.length / maxExpectedSkills) * 50));
        
        let overallScore = Math.min(100, score + contentBonus + skillMatchBonus);
        
        // Ensure user gets varying score based on real logic rather than hardcoded inflation
        if (overallScore === 0 && matched.length > 0) overallScore = 15;

        // Feedback based on real content
        const strengths = [];
        if (matched.length > 0) strengths.push(`Strong keyword matches in: ${matched.slice(0, 4).join(", ")}`);
        if (analysisType === "resume") {
            strengths.push("Professional resume format detected and successfully parsed");
            if (/\b(university|college|institute|bachelor|master|phd|degree)\b/i.test(resumeText)) {
                strengths.push("Educational background clearly stated");
            }
        }
        if (profileSkills.length > 0) strengths.push(`Profile is well-populated with ${profileSkills.length} skills`);

        const improvements = [];
        if (matched.length < 5) improvements.push("Consider adding more specific industry-standard tools/libraries to your resume text");
        if (missing.length > 0) improvements.push(`Missing high-demand skills like: ${missing.slice(0, 3).join(", ")}`);
        if (analysisType === "profile" && !user.resume) improvements.push("Upload a PDF resume for a more accurate AI analysis");
        
        if (analysisType === "resume") {
            const textLower = resumeText.toLowerCase();
            if (!textLower.includes("%") && !textLower.includes("increased") && !textLower.includes("improved")) {
                improvements.push("Add quantifiable achievements (e.g., 'Reduced costs by 15%')");
            }
        }

        const recommendedSkills = missing.slice(0, 6);
        
        // Best matches based on detected skills
        let bestMatches = [];
        const isFrontend = matched.some(s => ["React", "Angular", "Vue", "Frontend", "CSS"].includes(s));
        const isBackend = matched.some(s => ["Node.js", "Python", "Java", "Backend", "SQL"].includes(s));
        const isCloudDevOps = matched.some(s => ["AWS", "Docker", "Kubernetes", "Azure"].includes(s));

        if (isFrontend && isBackend) bestMatches.push("Full Stack Developer", "Software Engineer");
        else if (isFrontend) bestMatches.push("Frontend Developer", "UI Engineer", "React Developer");
        else if (isBackend) bestMatches.push("Backend Developer", "Java Developer", "Node.js Engineer");
        
        if (isCloudDevOps) bestMatches.push("DevOps Engineer", "Cloud Architect");
        
        if (bestMatches.length === 0) {
            bestMatches = ["Junior Developer", "Graduate Engineer", "Associate Consultant"];
        }

        res.status(200).json({
            success: true,
            data: {
                overallScore,
                analysisType,
                summary: overallScore >= 80 
                    ? "Exceptional! Your resume is highly optimized for Modern ATS systems."
                    : overallScore >= 60
                    ? "Good quality. Your resume clearly communicates your core competencies."
                    : "Your resume needs more detail. Recruiters might be missing crucial information about your skills.",
                strengths: strengths.slice(0, 3),
                improvements: improvements.slice(0, 3),
                matched: matched,
                recommendedSkills: recommendedSkills.length > 0 ? recommendedSkills : ["Cloud Computing", "AI Integration", "Leadership"],
                bestMatches: bestMatches.slice(0, 3)
            }
        });
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
