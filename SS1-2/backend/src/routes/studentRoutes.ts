import { Router } from "express";
import {
  getStudentDetails,
  getStudentOverview
} from "../controllers/studentController";
import { getChecklist, updateChecklist } from "../controllers/checklistController";
import { updateApprovalStatus } from "../controllers/approvalStatusController";
import { authMiddleware, requireRegistrarRole } from "../middleware/auth";

const router = Router();

router.use(authMiddleware, requireRegistrarRole);

router.get("/:studentNumber/overview", getStudentOverview);
router.get("/:studentNumber/details", getStudentDetails);
router.get("/:studentId/checklist", getChecklist);
router.patch("/:studentId/checklist", updateChecklist);
router.patch("/:studentId/status", updateApprovalStatus);

export default router;