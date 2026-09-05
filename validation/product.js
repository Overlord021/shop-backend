// ==================== Product Validation ====================

import { array, number, object, string } from "zod";

export const addProductSchema = object({
  name: string("نام محصول باید متن باشد")
    .min(1, "نام محصول نمی‌تواند خالی باشد")
    .trim()
    .optional()
    .nullable(),
  en_name: string("نام انگلیسی محصول الزامی است")
    .min(1, "نام انگلیسی محصول نمی‌تواند خالی باشد")
    .trim(),
  price: number("قیمت محصول باید عدد باشد")
    .min(10000, "قیمت محصول باید حداقل 10000 ریال باشد")
    .optional()
    .nullable(),
  dollar_price: number("قیمت دلاری محصول باید عدد باشد")
    .min(0, "قیمت دلاری نمی‌تواند منفی باشد")
    .optional()
    .nullable(),
  sale: number("تخفیف باید عدد باشد")
    .min(0, "تخفیف نمی‌تواند منفی باشد")
    .max(100, "تخفیف نمی‌تواند بیشتر از ۱۰۰ درصد باشد")
    .default(0)
    .optional()
    .nullable(),
  media: array(string().trim()).min(1, "حداقل یک تصویر برای محصول الزامی است"),
  category: string("دسته‌بندی الزامی است")
    .min(1, "دسته‌بندی نمی‌تواند خالی باشد")
    .trim(),
  brand: string("برند الزامی است").min(1, "برند نمی‌تواند خالی باشد").trim(),
}).refine(
  (data) =>
    (data.price !== null && data.price !== undefined) ||
    (data.dollar_price !== null && data.dollar_price !== undefined),
  {
    message: "محصول باید حداقل دارای یکی از قیمت‌های ریالی یا دلاری باشد",
    path: ["price"],
  }
);

export const updateProductSchema = object({
  name: string("نام محصول باید متن باشد")
    .min(1, "نام محصول نمی‌تواند خالی باشد")
    .trim()
    .optional()
    .nullable(),
  en_name: string("نام انگلیسی محصول باید متن باشد")
    .min(1, "نام انگلیسی محصول نمی‌تواند خالی باشد")
    .trim()
    .optional()
    .nullable(),
  price: number("قیمت محصول باید عدد باشد")
    .min(10000, "قیمت محصول باید حداقل 10000 ریال باشد")
    .optional()
    .nullable(),
  dollar_price: number("قیمت دلاری محصول باید عدد باشد")
    .min(0, "قیمت دلاری نمی‌تواند منفی باشد")
    .optional()
    .nullable(),
  sale: number("تخفیف باید عدد باشد")
    .min(0, "تخفیف نمی‌تواند منفی باشد")
    .max(100, "تخفیف نمی‌تواند بیشتر از ۱۰۰ درصد باشد")
    .default(0)
    .optional()
    .nullable(),
  media: array(string().trim())
    .min(1, "حداقل یک تصویر برای محصول الزامی است")
    .optional(),
  category: string("دسته‌بندی الزامی است")
    .min(1, "دسته‌بندی نمی‌تواند خالی باشد")
    .trim()
    .optional()
    .nullable(),
  brand: string("برند الزامی است")
    .min(1, "برند نمی‌تواند خالی باشد")
    .trim()
    .optional()
    .nullable(),
});
