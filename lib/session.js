// ==================== Session & JWT Management ====================

import { SignJWT, jwtVerify } from "jose";

export async function encrypt(payload) {
  const secretKey = process.env.SESSION_SECRET;
  const encodedKey = new TextEncoder().encode(secretKey);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const secretKey = process.env.SESSION_SECRET;
    const encodedKey = new TextEncoder().encode(secretKey);

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return "خطا در اعتبارسنجی نشست";
  }
}

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  return { expiresAt, session };
}

export async function verifySession(token) {
  const session = await decrypt(token);

  if (!session.userId) {
    return { isAuth: false };
  }

  return { isAuth: true, userId: session.userId };
}
