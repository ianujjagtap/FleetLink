import type { MongoError } from "mongodb";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const mongoError = error as MongoError;
    console.error(`Error connecting to MongoDB: ${mongoError.message}`);
    process.exit(1);
  }
};

export default connectDB;
