// ==================== Database Connection ====================

import mongoose from "mongoose";
import userModel from "../models/user.js";

export default async function initialMongoose() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI_STRING);

    // 1. Check the current number of users
    const userCount = await userModel.countDocuments();

    // 5. If there are already multiple users, STOP and report the situation
    if (userCount > 1) {
      console.error(
        `ERROR: Multiple users (${userCount}) found in database. Expected at most 1 user. Migration stopped.`
      );
      process.exit(1);
    }

    // 2. If there is exactly ONE existing user, safely ensure it has installed: 1
    if (userCount === 1) {
      // 3 & 4. Do not modify any existing user data except adding the internal installed field if necessary. Do not delete or recreate.
      await userModel.updateOne(
        { installed: { $ne: 1 } },
        { $set: { installed: 1 } }
      );
    }

    console.log("Server connected to DB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}