import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ Database Error: MONGO_URI is not defined.");
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`📡 Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
    }
};

export default connectDB;