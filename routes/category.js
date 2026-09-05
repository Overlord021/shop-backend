// ==================== Category Routes ====================

import { Router } from "express";

import {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", getCategory);
router.post("/", authMiddleware, addCategory);
router
  .route("/:id")
  .put(authMiddleware, updateCategory)
  .delete(authMiddleware, deleteCategory);

export default router;
