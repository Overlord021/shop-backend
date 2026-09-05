// ==================== Auth Middleware ====================

import { verifySession } from "../lib/session.js";

export default async function authMiddleware(req, res, next) {
  const cookies = req.cookies;
  const token = cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ message: "مجاز به انجام این کار نیستید", authorized: false });
  }

  const session = await verifySession(token);

  if (!session.isAuth) {
    return res
      .status(403)
      .json({ message: "مجاز به انجام این کار نیستید", authorized: false });
  }

  req.userId = session.userId;

  next();
}
