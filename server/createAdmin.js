import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const adminExists = await User.findOne({ email: "admin@gmail.com" });
        if (adminExists) {
            console.log("Admin already exists! Resetting password to password123 via hook...");
            adminExists.role = "admin";
            adminExists.password = "password123";
            await adminExists.save();
            console.log("Reset admin password successfully. You can login with: admin@gmail.com / password123");
        } else {
            console.log("Creating new admin...");
            await User.create({
                name: "Admin User",
                email: "admin@gmail.com",
                password: "password123",
                role: "admin",
            });
            console.log("Admin created successfully! Email: admin@gmail.com | Password: password123");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
