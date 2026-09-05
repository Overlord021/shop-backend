// ==================== Category Model ====================

import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      index: true,
    },
    en_name: {
      type: String,
      required: false,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const categoryModel = model("category", categorySchema);

export default categoryModel;
