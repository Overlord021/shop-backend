// ==================== Brand Routes ====================

import { Router } from "express";

import {
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", getBrand);
router.post("/", authMiddleware, addBrand);
router
  .route("/:id")
  .put(authMiddleware, updateBrand)
  .delete(authMiddleware, deleteBrand);

export default router;
