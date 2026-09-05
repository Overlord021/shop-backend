// ==================== Brand Validation ====================

import { object, string } from "zod";

export const addBrandSchema = object({
  name: string("نام برند باید رشته باشد").trim().optional().nullable(),
  en_name: string("نام انگلیسی برند باید رشته باشد").trim().optional().nullable(),
  logo: string("لطفاً یک آدرس معتبر برای لوگو وارد کنید")
    .min(1, "لوگو نمی‌تواند خالی باشد")
    .trim(),
}).refine(
  (data) =>
    (data.name && data.name.trim().length > 0) ||
    (data.en_name && data.en_name.trim().length > 0),
  {
    message: "نام برند یا نام انگلیسی برند الزامی است",
    path: ["name"],
  }
);

export const updateBrandSchema = object({
  name: string("نام برند باید رشته باشد").trim().optional().nullable(),
  en_name: string("نام انگلیسی برند باید رشته باشد").trim().optional().nullable(),
  logo: string("لطفاً یک آدرس معتبر برای لوگو وارد کنید").trim().optional().nullable(),
});
