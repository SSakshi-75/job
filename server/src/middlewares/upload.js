import multer from "multer";
import path from "path";

// Storage config
// Storage config - Use memory storage for Vercel compatibility
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;

    if (file.fieldname === "resume") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Resume must be a PDF file"), false);
        }
    } else {
        const extName = path.extname(file.originalname).toLowerCase().replace(".", "");
        if (allowedImageTypes.test(extName) || file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"), false);
        }
    }
};

export const uploadProfilePic = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
}).single("profilePicture");

export const uploadResume = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter,
}).single("resume");
