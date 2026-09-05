// ==================== Brand Model ====================

import { model, Schema } from "mongoose";

const brandSchema = new Schema(
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
    logo: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const brandModel = model("brand", brandSchema);

export default brandModel;
