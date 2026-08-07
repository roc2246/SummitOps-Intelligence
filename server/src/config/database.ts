import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

export async function connectDatabase(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection failed. Ensure MongoDB is running and MONGODB_URI is correct.",
      error,
    );
    throw error;
  }
}
