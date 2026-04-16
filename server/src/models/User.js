import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    role: {
        type: String,
        enum: ["job-seeker", "recruiter", "admin"],
        default: "job-seeker",
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },

    // ── Profile Fields ──
    phone: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    skills: {
        type: [String],
        default: [],
    },
    profilePicture: {
        type: String,
        default: "",
    },
    resume: {
        type: String,
        default: "",
    },

    // ── Recruiter-specific ──
    company: {
        type: String,
        default: "",
    },
    companyLogo: {
        type: String,
        default: "",
    },
    companyWebsite: {
        type: String,
        default: "",
    },

    // ── Job Seeker-specific ──
    experience: {
        type: String,
        default: "",
    },
    education: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT Token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export default mongoose.model("User", userSchema);
