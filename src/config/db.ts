import type { MongoError } from "mongodb";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
  } catch (error) {
    const mongoError = error as MongoError;
    console.error(`Error connecting to MongoDB: ${mongoError.message}`);
    process.exit(1);
  }
};

export default connectDB;
