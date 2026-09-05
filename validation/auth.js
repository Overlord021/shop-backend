// ==================== Auth Validation ====================

import { object, string } from "zod";

export const signUpSchema = object({
  name: string("نام الزامی است")
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .max(10, "نام نمی‌تواند بیشتر از ۱۰ کاراکتر باشد")
    .trim(),
  email: string("ایمیل الزامی است").email("لطفاً یک آدرس ایمیل معتبر وارد کنید").trim(),
  password: string("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(10, "رمز عبور نمی‌تواند بیشتر از ۱۰ کاراکتر باشد")
    .trim(),
});

export const signInSchema = object({
  email: string("ایمیل الزامی است").email("لطفاً یک آدرس ایمیل معتبر وارد کنید").trim(),
  password: string("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(10, "رمز عبور نمی‌تواند بیشتر از ۱۰ کاراکتر باشد")
    .trim(),
});
