import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        const users = await User.find().select('name email role');
        console.log(`Total users: ${count}`);
        console.log('Users:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
