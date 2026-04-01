import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedDocTypes = /pdf/;

    const extName = path.extname(file.originalname).toLowerCase().replace(".", "");

    if (file.fieldname === "resume") {
        if (allowedDocTypes.test(extName)) {
            cb(null, true);
        } else {
            cb(new Error("Resume must be a PDF file"), false);
        }
    } else {
        if (allowedImageTypes.test(extName)) {
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
