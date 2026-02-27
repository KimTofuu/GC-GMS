import { Request, Response } from "express";
import {
  getStudentDetailsByStudentNumber,
  getStudentOverviewByStudentNumber,
  validateStudentNumber
} from "../services/studentService";

export const getStudentOverview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentNumber = validateStudentNumber(req.params.studentNumber);
    const data = await getStudentOverviewByStudentNumber(studentNumber);

    if (!data) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid studentNumber", details: error });
      return;
    }
    throw error;
  }
};

export const getStudentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentNumber = validateStudentNumber(req.params.studentNumber);
    const data = await getStudentDetailsByStudentNumber(studentNumber);

    if (!data) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid studentNumber", details: error });
      return;
    }
    throw error;
  }
};