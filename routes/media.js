// ==================== Media Routes ====================

import { Router } from "express";

import { getMedia, addMedia, updateMedia, deleteMedia } from "../controllers/media.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", getMedia);
router.post("/", authMiddleware, addMedia);
router.put("/:id", authMiddleware, updateMedia);
router.patch("/:id", authMiddleware, updateMedia);
router.delete("/:id", authMiddleware, deleteMedia);

export default router;


