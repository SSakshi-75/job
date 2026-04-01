import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc    Get dashboard metrics (User growth, Job volume)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSeekers = await User.countDocuments({ role: "job-seeker" });
        const totalRecruiters = await User.countDocuments({ role: "recruiter" });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Active jobs
        const activeJobs = await Job.countDocuments({ status: "active" });

        // Month-over-month users (aggregation)
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Jobs posted by month
        const jobVolume = await Job.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalUsers,
                    totalSeekers,
                    totalRecruiters,
                    totalJobs,
                    activeJobs,
                    totalApplications
                },
                charts: {
                    userGrowth,
                    jobVolume
                }
            }
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select("-password");
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in getAllUsersAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
export const getAllJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error in getAllJobsAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Ban or Unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot ban an admin" });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: `User successfully ${user.isBanned ? 'banned' : 'unbanned'}`,
            data: user 
        });
    } catch (error) {
        console.error("Error in toggleBanUser:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete any job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
export const deleteJobAdmin = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        await job.deleteOne();

        // Delete related applications
        await Application.deleteMany({ job: job._id });

        res.status(200).json({ success: true, message: "Job and associated applications deleted securely by admin" });
    } catch (error) {
        console.error("Error in deleteJobAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
