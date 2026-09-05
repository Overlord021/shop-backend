// ==================== Media Model ====================

import { model, Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

mediaSchema.index({ labels: 1 });

const mediaModel = model("media", mediaSchema);

export default mediaModel;

