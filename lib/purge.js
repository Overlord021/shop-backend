import mongoose from "mongoose";

async function purge() {
  try {
    await mongoose.connect("mongodb://localhost:27017/shop");
    await mongoose.connection.dropDatabase();

    console.log("Database dropped successfully");
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    await mongoose.disconnect();
  }
}

purge();
