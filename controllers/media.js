// ==================== Media Controller ====================

import mediaModel from "../models/media.js";
import { addMediaSchema, updateMediaSchema } from "../validation/media.js";
import { isValidObjectId } from "mongoose";
import flattenZodError from "../lib/flatten-error.js";

export function normalizeLabels(labels) {
  if (!Array.isArray(labels)) return [];
  return [...new Set(labels.map((l) => (typeof l === "string" ? l.trim() : "")).filter(Boolean))];
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getMedia(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
  const q = req.query.q ? String(req.query.q).trim().slice(0, 100) : "";

  const query = {};
  if (q) {
    query.labels = { $regex: new RegExp(`^${escapeRegExp(q)}$`, "i") };
  }

  const total = await mediaModel.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  const validPage = Math.min(page, totalPages);

  const data = await mediaModel
    .find(query)
    .skip((validPage - 1) * limit)
    .limit(limit)
    .lean();

  return res.status(200).json({
    data,
    pagination: {
      page: validPage,
      limit,
      total,
      totalPages,
    },
  });
}

export async function addMedia(req, res) {
  const validate = addMediaSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const { url, labels } = validate.data;
  const normalizedLabels = normalizeLabels(labels);

  const media = await mediaModel.create({
    url,
    labels: normalizedLabels,
  });

  return res.status(201).json(media);
}

export async function updateMedia(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه رسانه معتبر نمی باشد" });
  }

  const validate = updateMediaSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const updateData = {};
  if (validate.data.labels !== undefined) {
    updateData.labels = normalizeLabels(validate.data.labels);
  }

  const media = await mediaModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!media) {
    return res.status(404).json({ message: "رسانه وجود ندارد" });
  }

  return res.status(200).json(media);
}

export async function deleteMedia(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "مشخصه رسانه معتبر نمی باشد" });
  }

  const media = await mediaModel.deleteOne({ _id: id });

  if (!media.acknowledged) {
    return res.status(404).json({ message: "رسانه وجود ندارد" });
  }

  return res.status(200).json({ mediaId: id, success: media.acknowledged });
}


