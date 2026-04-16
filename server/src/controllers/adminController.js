import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";

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
        const jobs = await Job.find().populate("recruiter", "name email").sort({ createdAt: -1 });
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

// @desc    Delete a user (and all their data)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot delete an admin account" });
        }

        // Delete all applications
        await Application.deleteMany({ $or: [{ applicant: user._id }, { recruiter: user._id }] });
        // Delete all jobs if recruiter
        await Job.deleteMany({ recruiter: user._id });
        // Delete interviews
        await Interview.deleteMany({ $or: [{ applicant: user._id }, { recruiter: user._id }] });
        // Delete the user
        await user.deleteOne();

        res.status(200).json({ success: true, message: "User and all associated data deleted" });
    } catch (error) {
        console.error("Error in deleteUserAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["job-seeker", "recruiter", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Cannot demote an admin" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ success: true, message: `User role changed to ${role}`, data: user });
    } catch (error) {
        console.error("Error in changeUserRole:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Toggle job status (active/inactive)
// @route   PUT /api/admin/jobs/:id/status
// @access  Private/Admin
export const toggleJobStatus = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        job.status = job.status === "active" ? "inactive" : "active";
        await job.save();

        res.status(200).json({ success: true, message: `Job is now ${job.status}`, data: job });
    } catch (error) {
        console.error("Error in toggleJobStatus:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get all applications (admin view)
// @route   GET /api/admin/applications
// @access  Private/Admin
export const getAllApplicationsAdmin = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("applicant", "name email")
            .populate("recruiter", "name email company")
            .populate("job", "title company")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error in getAllApplicationsAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete any application
// @route   DELETE /api/admin/applications/:id
// @access  Private/Admin
export const deleteApplicationAdmin = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }
        await application.deleteOne();
        res.status(200).json({ success: true, message: "Application deleted" });
    } catch (error) {
        console.error("Error in deleteApplicationAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get all interviews (admin view)
// @route   GET /api/admin/interviews
// @access  Private/Admin
export const getAllInterviewsAdmin = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate("applicant", "name email")
            .populate("recruiter", "name email company")
            .populate("job", "title company")
            .sort({ scheduledAt: -1 });

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        console.error("Error in getAllInterviewsAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete any interview
// @route   DELETE /api/admin/interviews/:id
// @access  Private/Admin
export const deleteInterviewAdmin = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        await interview.deleteOne();
        res.status(200).json({ success: true, message: "Interview deleted" });
    } catch (error) {
        console.error("Error in deleteInterviewAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
