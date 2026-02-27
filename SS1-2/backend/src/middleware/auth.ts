import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtUser } from "../types/jwt";

const AUTH_HEADER_PREFIX = "Bearer ";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.header("Authorization");

  if (!header || !header.startsWith(AUTH_HEADER_PREFIX)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = header.substring(AUTH_HEADER_PREFIX.length).trim();

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRegistrarRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const allowedRoles = new Set(["ADMIN"]);

  if (!allowedRoles.has(user.role)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
};

