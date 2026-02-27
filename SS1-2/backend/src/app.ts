import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: ".env.dev" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*"
  })
);
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;

