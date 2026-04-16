import User from "../models/User.js";
import Job from "../models/Job.js";

// @desc    Get all unique companies with job counts
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const stats = await Job.aggregate([
            { $match: { status: "active" } },
            {
                $group: {
                    _id: "$company",
                    jobCount: { $sum: 1 },
                    logo: { $first: "$companyLogo" },
                    recruiterId: { $first: "$recruiter" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "recruiterId",
                    foreignField: "_id",
                    as: "recruiterInfo"
                }
            },
            {
                $project: {
                    name: "$_id",
                    jobCount: 1,
                    logo: 1,
                    location: { $ifNull: [{ $arrayElemAt: ["$recruiterInfo.location", 0] }, "Remote Hub"] },
                    industry: { $ifNull: [{ $arrayElemAt: ["$recruiterInfo.industry", 0] }, "Technology"] }
                }
            },
            { $sort: { jobCount: -1 } }
        ]);

        // Forced Fallback Logos for ALL Companies to GUARANTEE they always appear
        const topBrandLogos = {
            "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png",
            "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            "Tesla": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
            "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            "Spotify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg",
            "SpaceX": "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo.svg",
            "Cloud Solutions": "https://cdn-icons-png.flaticon.com/512/5968/5968267.png",
            "Creative Studio": "https://cdn-icons-png.flaticon.com/512/3659/3659030.png",
            "StartUp Inc": "https://cdn-icons-png.flaticon.com/512/261/261768.png"
        };

        const enrichedStats = stats.map(comp => ({
            ...comp,
            logo: comp.logo || topBrandLogos[comp.name] || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }));

        res.status(200).json({ success: true, data: enrichedStats });
    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ success: false, message: "Server error during data aggregation" });
    }
};

// @desc    Get company details and their jobs
// @route   GET /api/companies/:name
// @access  Public
export const getCompanyDetails = async (req, res) => {
    try {
        const companyName = req.params.name;
        
        const jobs = await Job.find({ 
            company: { $regex: new RegExp(`^${companyName}$`, "i") },
            status: "active"
        }).populate("recruiter", "name email location industry");

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "Company not found or has no active jobs" });
        }

        const companyInfo = {
            name: jobs[0].company,
            logo: jobs[0].companyLogo,
            location: jobs[0].recruiter?.location,
            industry: jobs[0].recruiter?.industry,
            jobs: jobs
        };

        res.status(200).json({ success: true, data: companyInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
