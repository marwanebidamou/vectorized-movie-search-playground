import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI as string, {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;