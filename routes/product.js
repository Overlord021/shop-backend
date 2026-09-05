// ==================== Product Routes ====================

import { Router } from "express";

import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductByCategory,
  getProductBySale,
  updateProduct,
} from "../controllers/product.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/sale", getProductBySale);
router.get("/category/:categoryName", getProductByCategory);
router.get("/", getProduct);
router.get("/:id", getProduct);

router.post("/", authMiddleware, addProduct);

router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);
export default router;
