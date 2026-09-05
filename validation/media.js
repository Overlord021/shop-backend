// ==================== Media Validation ====================

import { object, string, array } from "zod";

export const addMediaSchema = object({
  url: string("آدرس فایل الزامی است")
    .min(1, "آدرس فایل نمی‌تواند خالی باشد")
    .trim(),
  labels: array(
    string("برچسب باید متن باشد")
      .max(100, "برچسب نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
      .trim()
  )
    .max(30, "تعداد برچسب‌ها نمی‌تواند بیشتر از ۳۰ باشد")
    .optional()
    .default([]),
});

export const updateMediaSchema = object({
  labels: array(
    string("برچسب باید متن باشد")
      .max(100, "برچسب نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
      .trim()
  )
    .max(30, "تعداد برچسب‌ها نمی‌تواند بیشتر از ۳۰ باشد")
    .optional(),
});


