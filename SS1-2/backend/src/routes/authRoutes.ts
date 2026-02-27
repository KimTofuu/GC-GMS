import { Router } from "express";
import { getCurrentUser, login } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;

