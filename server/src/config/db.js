import mongoose from "mongoose";

const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ Database Error: MONGO_URI is not defined.");
        return;
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        console.log("📡 Database Connected Successfully");
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
    }
};

export default connectDB;