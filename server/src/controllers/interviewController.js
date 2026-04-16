import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// @desc    Schedule an interview (Recruiter)
// @route   POST /api/interviews
// @access  Private - Recruiter
export const scheduleInterview = async (req, res) => {
    try {
        const { applicationId, scheduledAt, mode, meetingLink, notes } = req.body;

        const application = await Application.findById(applicationId).populate("job");
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });

        // Only the recruiter of that job can schedule
        if (application.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const interview = await Interview.create({
            application: applicationId,
            job: application.job._id,
            applicant: application.applicant,
            recruiter: req.user._id,
            scheduledAt,
            mode: mode || "video",
            meetingLink: meetingLink || "",
            notes: notes || "",
        });

        // Notify the applicant
        await Notification.create({
            recipient: application.applicant,
            sender: req.user._id,
            type: "message",
            content: `Interview scheduled for "${application.job.title}" on ${new Date(scheduledAt).toLocaleDateString()} via ${mode || "video"}`,
            job: application.job._id,
            application: applicationId,
        });

        // Update application status to reviewed
        application.status = "reviewed";
        await application.save();

        res.status(201).json({ success: true, data: interview, message: "Interview scheduled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get interviews for recruiter
// @route   GET /api/interviews/my-scheduled
// @access  Private - Recruiter
export const getRecruiterInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ recruiter: req.user._id })
            .populate("applicant", "name email profilePicture")
            .populate("job", "title company")
            .populate("application", "status")
            .sort({ scheduledAt: 1 });

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get interviews for applicant (job seeker)
// @route   GET /api/interviews/my-interviews
// @access  Private - Job Seeker
export const getApplicantInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ applicant: req.user._id })
            .populate("recruiter", "name email profilePicture company")
            .populate("job", "title company companyLogo")
            .sort({ scheduledAt: 1 });

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update interview status
// @route   PUT /api/interviews/:id
// @access  Private - Recruiter
export const updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

        if (interview.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
