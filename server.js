// ==================== Server Configuration ====================

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./lib/swagger/swagger-output.json" with { type: "json" };

dotenv.config();

import initialMongoose from "./lib/db.js";

import authRouter from "./routes/auth.js";
import brandRouter from "./routes/brand.js";
import categoryRouter from "./routes/category.js";
import mediaRouter from "./routes/media.js";
import productRouter from "./routes/product.js";

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/media", mediaRouter);
app.use("/api/product", productRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res) => {
  return res.status(404).json({
    message: "آدرس درخواست شده وجود ندارد",
  });
});

async function start() {
  await initialMongoose();
  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
}

start();

