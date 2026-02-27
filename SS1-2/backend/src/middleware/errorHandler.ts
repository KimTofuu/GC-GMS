import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      issues: err.issues
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error"
  });
};

