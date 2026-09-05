// ==================== User Model ====================

import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 100,
    },
  },
  {
    versionKey: false,
  },
);

const userModel = model("user", userSchema);

export default userModel;
