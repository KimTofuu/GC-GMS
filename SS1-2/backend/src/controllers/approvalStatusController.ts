import { Request, Response } from "express";
import {
  upsertApprovalStatusForStudent,
  validateApprovalStatusBody,
  validateStudentIdForStatus
} from "../services/approvalStatusService";

export const updateApprovalStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = validateStudentIdForStatus(req.params.studentId);
    const body = validateApprovalStatusBody(req.body);

    const updated = await upsertApprovalStatusForStudent(studentId, body);
    res.json(updated);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({ message: "Invalid request", details: error });
      return;
    }
    throw error;
  }
};

