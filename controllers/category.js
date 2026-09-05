// ==================== Category Controller ====================

import categoryModel from "../models/category.js";
import {
  addCategorySchema,
  updateCategorySchema,
} from "../validation/category.js";
import { isValidObjectId } from "mongoose";
import flattenZodError from "../lib/flatten-error.js";

export async function getCategory(req, res) {
  const categories = await categoryModel.find().lean();
  return res.status(200).json(categories);
}

export async function addCategory(req, res) {
  const validate = addCategorySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const category = await categoryModel.create(data);

  return res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه دسته بندی معتبر نمی باشد" });
  }

  const validate = updateCategorySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const category = await categoryModel.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
  );

  if (!category.acknowledged) {
    return res.status(404).json({ message: "دسته بندی وجود ندارد" });
  }

  return res
    .status(201)
    .json({ categoryId: id, success: category.acknowledged });
}

export async function deleteCategory(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه دسته بندی معتبر نمی باشد" });
  }

  const category = await categoryModel.deleteOne({ _id: id });

  if (!category.acknowledged) {
    return res.status(404).json({ message: "دسته بندی وجود ندارد" });
  }

  return res
    .status(200)
    .json({ categoryId: id, success: category.acknowledged });
}
