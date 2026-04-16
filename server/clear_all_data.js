import mongoose from "mongoose";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
            console.log(`Cleared collection: ${collection.collectionName}`);
        }

        console.log("\nDATABASE WIPED SUCCESSFULLY!\n");

        // Clear Uploads
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            for (const file of files) {
                if (file !== ".gitkeep" && file !== "placeholder.txt") {
                    fs.unlinkSync(path.join(uploadsDir, file));
                    console.log(`Deleted file: ${file}`);
                }
            }
            console.log("\nUPLOADS CLEARED SUCCESSFULLY!\n");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error clearing data:", err);
        process.exit(1);
    }
};

clearData();
