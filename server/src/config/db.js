import mongoose from "mongoose";

let cachedPromise = null;

const connectDB = async () => {
    // Disable buffering globally for new models
    mongoose.set('bufferCommands', false);

    // If fully connected, return
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If currently connecting, wait for the existing promise
    if (cachedPromise) {
        console.log("⏳ Waiting for existing DB connection promise...");
        await cachedPromise;
        return mongoose.connection;
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ Database Error: MONGO_URI is not defined.");
        throw new Error("MONGO_URI is not defined");
    }
    console.log(`🔍 Attempting to connect to: ${uri.split("@")[1] || "invalid-uri"}`);

    try {
        if (mongoose.connection.listeners('connected').length === 0) {
            mongoose.connection.on("connected", () => {
                console.log("📡 Mongoose connected to DB Cluster");
            });

            mongoose.connection.on("error", (err) => {
                console.error(`❌ Mongoose connection error: ${err.message}`);
            });

            mongoose.connection.on("disconnected", () => {
                console.log("🔌 Mongoose disconnected");
                cachedPromise = null; // Reset promise on disconnect
            });
        }

        cachedPromise = mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        await cachedPromise;
        console.log("📡 Database Connection Call Successful");
        return mongoose.connection;
    } catch (error) {
        cachedPromise = null;
        console.error(`❌ Database Initial Connection Error: ${error.message}`);
        throw error;
    }
};

export default connectDB;