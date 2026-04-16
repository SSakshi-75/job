import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        mode: {
            type: String,
            enum: ["video", "phone", "in-person"],
            default: "video",
        },
        meetingLink: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled", "rescheduled"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
