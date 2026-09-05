// ==================== Product Model ====================

import { model, Types, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      index: true,
    },
    en_name: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      default: null,
      index: true,
    },
    dollar_price: {
      type: Number,
      default: null,
      index: true,
    },
    sale: {
      type: Number,
      default: 0,
      index: true,
    },
    media: [
      {
        type: Types.ObjectId,
        ref: "media",
      },
    ],
    category: {
      type: Types.ObjectId,
      ref: "category",
      index: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "brand",
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

const productModel = model("product", productSchema);

export default productModel;
