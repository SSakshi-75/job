import User from "../models/User.js";

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

        res.status(200).json({ success: true, data: user, filePath });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
