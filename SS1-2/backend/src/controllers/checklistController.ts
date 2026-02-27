import { Request, Response } from "express";
import {
  getChecklistForStudent,
  updateChecklistForStudent,
  validateChecklistUpdateBody,
  validateStudentId
} from "../services/checklistService";

export const getChecklist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = validateStudentId(req.params.studentId);
    const items = await getChecklistForStudent(studentId);
    res.json(items);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid request", details: error });
      return;
    }
    throw error;
  }
};

export const updateChecklist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = validateStudentId(req.params.studentId);
    const { items } = validateChecklistUpdateBody(req.body);

    const updated = await updateChecklistForStudent(studentId, items);
    res.json(updated);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid request", details: error });
      return;
    }
    throw error;
  }
};

