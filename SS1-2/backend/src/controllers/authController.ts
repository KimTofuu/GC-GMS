import { Request, Response } from "express";
import {
  authenticateUser,
  getUserById,
  validateLoginInput
} from "../services/authService";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = validateLoginInput(req.body);
    const token = await authenticateUser(input);

    if (!token) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.json({ token });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid request", details: error });
      return;
    }

    throw error;
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const dbUser = await getUserById(user.userId);

  if (!dbUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(dbUser);
};

