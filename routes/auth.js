// ==================== Auth Routes ====================

import { Router } from "express";
import { session, signIn, signOut, signUp, signUpStatus } from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";
import rateLimit from "../middlewares/rateLimit.js";

const router = Router();

const authLimiter = rateLimit(60 * 1000, 20);

router.post("/sign-up", authLimiter, signUp);
router.post("/sign-in", authLimiter, signIn);
router.delete("/sign-out", authMiddleware, signOut);
router.get("/session", authMiddleware, session);
router.get("/status", signUpStatus);
router.get("/sign-up-status", signUpStatus);

export default router;

