// ==================== Database Connection ====================

import mongoose from "mongoose";

export default async function initialMongoose() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI_STRING);

    console.log("Server connected to DB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}