// ==================== Database Connection ====================

import mongoose from "mongoose";
import userModel from "../models/user.js";

export default async function initialMongoose() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI_STRING);

    // Ensure existing user has installed field for singleton uniqueness constraint without modifying other fields
    await userModel.updateMany(
      { installed: { $ne: 1 } },
      { $set: { installed: 1 } }
    );

    console.log("Server connected to DB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}