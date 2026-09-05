// ==================== Category Validation ====================

import { object, string } from "zod";

export const addCategorySchema = object({
  name: string("نام دسته‌بندی باید رشته باشد").trim().optional().nullable(),
  en_name: string("نام انگلیسی دسته‌بندی باید رشته باشد").trim().optional().nullable(),
  image: string("لطفاً یک آدرس معتبر برای تصویر وارد کنید")
    .min(1, "تصویر نمی‌تواند خالی باشد")
    .trim(),
}).refine(
  (data) =>
    (data.name && data.name.trim().length > 0) ||
    (data.en_name && data.en_name.trim().length > 0),
  {
    message: "نام دسته‌بندی یا نام انگلیسی دسته‌بندی الزامی است",
    path: ["name"],
  }
);

export const updateCategorySchema = object({
  name: string("نام دسته‌بندی باید رشته باشد").trim().optional().nullable(),
  en_name: string("نام انگلیسی دسته‌بندی باید رشته باشد").trim().optional().nullable(),
  image: string("لطفاً یک آدرس معتبر برای تصویر وارد کنید").trim().optional().nullable(),
});
