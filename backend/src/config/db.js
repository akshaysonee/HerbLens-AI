import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(env.MONGODB_URI);

    isConnected = conn.connections[0].readyState === 1;

    console.log(`MongoDB connected`);

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
