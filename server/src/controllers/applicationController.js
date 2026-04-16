import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

// Apply to a job by job seeker
export const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applicantId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job." });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: applicantId,
            recruiter: job.recruiter, // Changed from postedBy to recruiter
            status: "pending"
        });

        // Increment applicant count on job
        job.applicantsCount = (job.applicantsCount || 0) + 1;
        await job.save();

        // Create notification for Recruiter
        await Notification.create({
            recipient: job.recruiter,
            sender: applicantId,
            type: "application",
            content: `New application received for "${job.title}"`,
            job: jobId,
            application: application._id
        });

        res.status(201).json({ success: true, data: application, message: "Application submitted successfully" });
    } catch (error) {
        console.error("Error in applyToJob:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get jobs applied by the current user (Job-Seeker)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error in getMyApplications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all applications received by the current recruiter
export const getRecruiterApplications = async (req, res) => {
    try {
        const applications = await Application.find({ recruiter: req.user._id })
            .populate("applicant", "name email profilePicture bio skills resume experience education location")
            .populate("job", "title company")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error in getRecruiterApplications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get applicants for a specific job (Recruiter)
export const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Ensure the job exists and belongs to the recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to view applicants for this job" });
        }

        const applicants = await Application.find({ job: jobId })
            .populate("applicant", "name email profilePicture bio skills resume experience education location")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: applicants });
    } catch (error) {
        console.error("Error in getJobApplicants:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update application status (Recruiter)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId).populate("job");
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (application.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this application" });
        }

        application.status = status;
        await application.save();

        // Create notification for Job Seeker
        await Notification.create({
            recipient: application.applicant,
            sender: req.user._id,
            type: "status_change",
            content: `Your application for "${application.job.title}" has been ${status}`,
            job: application.job._id,
            application: application._id
        });

        res.status(200).json({ success: true, data: application, message: "Status updated" });
    } catch (error) {
        console.error("Error in updateApplicationStatus:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
