// ==================== Brand Controller ====================

import brandModel from "../models/brand.js";
import { addBrandSchema, updateBrandSchema } from "../validation/brand.js";
import { isValidObjectId } from "mongoose";
import flattenZodError from "../lib/flatten-error.js";

export async function getBrand(req, res) {
  const brands = await brandModel.find().lean();
  return res.status(200).json(brands);
}

export async function addBrand(req, res) {
  const validate = addBrandSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const brand = await brandModel.create(data);

  return res.status(201).json(brand);
}

export async function updateBrand(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه برند معتبر نمی باشد" });
  }

  const validate = updateBrandSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const brand = await brandModel.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
  );

  if (!brand.acknowledged) {
    return res.status(404).json({ message: "برند وجود ندارد" });
  }

  return res.status(201).json({ brandId: id, success: brand.acknowledged });
}

export async function deleteBrand(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه برند معتبر نمی باشد" });
  }

  const brand = await brandModel.deleteOne({ _id: id });

  if (!brand.acknowledged) {
    return res.status(404).json({ message: "برند وجود ندارد" });
  }

  return res.status(200).json({ brandId: id, success: brand.acknowledged });
}
