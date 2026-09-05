// ==================== Product Controller ====================

import productModel from "../models/product.js";
import categoryModel from "../models/category.js";
import brandModel from "../models/brand.js";
import { isValidObjectId } from "mongoose";
import {
  addProductSchema,
  updateProductSchema,
} from "../validation/product.js";
import flattenZodError from "../lib/flatten-error.js";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProduct(req, res) {
  const { id } = req.params;

  if (!id) {
    const {
      q,
      page = 1,
      limit = 20,
      lang = "fa",
      category,
      brand,
      sale,
      currency,
    } = req.query;

    const filter = {};

    if (q) {
      const sanitizedQ = escapeRegExp(String(q).trim().slice(0, 100));
      if (sanitizedQ) {
        if (lang === "en") {
          filter.en_name = { $regex: new RegExp(sanitizedQ, "i") };
        } else {
          filter.$or = [
            { name: { $regex: new RegExp(sanitizedQ, "i") } },
            { en_name: { $regex: new RegExp(sanitizedQ, "i") } },
          ];
        }
      }
    }

    if (category) {
      let catDoc = null;
      if (isValidObjectId(category)) {
        catDoc = await categoryModel.findById(category).lean();
      }
      if (!catDoc) {
        catDoc = await categoryModel
          .findOne({
            $or: [{ en_name: category }, { name: category }],
          })
          .lean();
      }
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        filter.category = null;
      }
    }

    if (brand) {
      let brandDoc = null;
      if (isValidObjectId(brand)) {
        brandDoc = await brandModel.findById(brand).lean();
      }
      if (!brandDoc) {
        brandDoc = await brandModel
          .findOne({
            $or: [{ en_name: brand }, { name: brand }],
          })
          .lean();
      }
      if (brandDoc) {
        filter.brand = brandDoc._id;
      } else {
        filter.brand = null;
      }
    }

    if (sale !== undefined) {
      if (sale === "true" || sale === "1" || Number(sale) > 0) {
        filter.sale = { $gt: 0 };
      } else {
        filter.sale = Number(sale) || 0;
      }
    }

    if (currency === "toman") {
      filter.price = { $exists: true, $ne: null };
    } else if (currency === "usd" || currency === "dollar") {
      filter.dollar_price = { $exists: true, $ne: null };
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const products = await productModel
      .find(filter)
      .populate(["media", "category", "brand"], "-__v")
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه محصول معتبر نمی باشد" });
  }

  const product = await productModel
    .findById(id)
    .populate(["media", "category", "brand"], "-__v")
    .lean();

  if (!product) {
    return res.status(404).json({ message: "محصول یافت نشد" });
  }

  return res.status(200).json(product);
}

export async function getProductBySale(req, res) {
  const { currency, page = 1, limit = 20 } = req.query;

  const filter = { sale: { $gt: 0 } };

  if (currency === "toman") {
    filter.price = { $exists: true, $ne: null };
  } else if (currency === "usd" || currency === "dollar") {
    filter.dollar_price = { $exists: true, $ne: null };
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const total = await productModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const products = await productModel
    .find(filter)
    .populate(["media", "category", "brand"], "-__v")
    .skip(skip)
    .limit(limitNum)
    .lean();

  return res.status(200).json({
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
}

export async function getProductByCategory(req, res) {
  const { categoryName } = req.params;
  const { currency, page = 1, limit = 20 } = req.query;

  if (!categoryName) {
    return res.status(404).json({ message: "دسته بندی یافت نشد" });
  }

  let category = null;
  if (isValidObjectId(categoryName)) {
    category = await categoryModel.findById(categoryName).lean();
  }
  if (!category) {
    category = await categoryModel
      .findOne({
        $or: [{ en_name: categoryName }, { name: categoryName }],
      })
      .lean();
  }

  if (!category) {
    return res.status(404).json({ message: "دسته بندی یافت نشد" });
  }

  const filter = { category: category._id };

  if (currency === "toman") {
    filter.price = { $exists: true, $ne: null };
  } else if (currency === "usd" || currency === "dollar") {
    filter.dollar_price = { $exists: true, $ne: null };
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const total = await productModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const products = await productModel
    .find(filter)
    .populate(["media", "brand"], "-__v")
    .skip(skip)
    .limit(limitNum)
    .lean();

  return res.status(200).json({
    ...category,
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
}

export async function addProduct(req, res) {
  const validate = addProductSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const product = await productModel.create(data);

  return res.status(201).json({ _id: product._id, name: product.name });
}

export async function updateProduct(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه محصول معتبر نمی باشد" });
  }

  const validate = updateProductSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const product = await productModel.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
  );

  if (!product.acknowledged) {
    return res.status(404).json({ message: "محصول وجود ندارد" });
  }

  return res.status(201).json({ productId: id, success: product.acknowledged });
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه محصول معتبر نمی باشد" });
  }

  const product = await productModel.deleteOne({ _id: id });

  if (!product.acknowledged) {
    return res.status(404).json({ message: "محصول وجود ندارد" });
  }

  return res.status(200).json({ productId: id, success: product.acknowledged });
}
