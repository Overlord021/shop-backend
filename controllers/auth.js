// ==================== Auth Controller ====================

import userModel from "../models/user.js";

import bcrypt from "bcrypt";

import { signInSchema, signUpSchema } from "../validation/auth.js";
import { createSession, verifySession } from "../lib/session.js";
import flattenZodError from "../lib/flatten-error.js";

export async function signUp(req, res) {
  const userCount = await userModel.countDocuments();

  if (userCount >= 1) {
    return res.status(409).json({
      message: "ثبت‌نام در حال حاضر غیرفعال است. از صفحه ورود برای ورود به حساب استفاده کنید.",
      message_en: "Registration is currently disabled. Please use Sign In to access the account.",
      success: false,
    });
  }

  const validate = signUpSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const data = validate.data;

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const { _id, name } = await userModel.create({
      ...data,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "کاربر با موفقیت ساخته شد",
      success: true,
      user: {
        id: _id,
        name,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.installed || error.message?.includes("installed")) {
        return res.status(409).json({
          message: "ثبت‌نام در حال حاضر غیرفعال است. از صفحه ورود برای ورود به حساب استفاده کنید.",
          message_en: "Registration is currently disabled. Please use Sign In to access the account.",
          success: false,
        });
      }

      return res.status(409).json({
        message: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است",
        success: false,
      });
    }

    throw error;
  }
}

export async function registerStatus(req, res) {
  const userCount = await userModel.countDocuments();
  return res.status(200).json({
    enabled: userCount === 0,
  });
}

export async function signIn(req, res) {
  const validate = signInSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(422).json(flattenZodError(validate.error));
  }

  const { email, password } = validate.data;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "کاربر با این ایمیل وجود ندارد",
      success: false,
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(403).json({
      message: "رمز عبور نادرست است",
      success: false,
    });
  }

  const userId = user._id.toString();

  const { expiresAt, session } = await createSession(userId);

  res.cookie("token", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    token: session,
    authorized: true,
    success: true,
  });
}

export async function signOut(req, res) {
  res.clearCookie("token");
  return res.status(200).json({
    message: "نشست با موفقیت حذف شد",
    success: true,
  });
}

export async function session(req, res) {
  const { token } = req.cookies;

  if (!token) {
    res.clearCookie("token");
    return res.status(200).json({
      message: "نشست وجود ندارد",
    });
  }

  const session = await verifySession(token);

  if (!session.isAuth) {
    return res.status(403).json({
      authorized: false,
    });
  }

  return res.status(200).json({
    authorized: true,
    session: {
      id: session.userId,
    },
  });
}
