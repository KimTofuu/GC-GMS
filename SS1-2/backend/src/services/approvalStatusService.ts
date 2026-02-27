import { z } from "zod";
import { dbPool } from "../config/db";

const studentIdSchema = z.string().uuid();

export const validateStudentIdForStatus = (value: unknown): string => {
  return studentIdSchema.parse(value);
};

const approvalStatusUpdateSchema = z.object({
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  vpaaApproved: z.boolean(),
  finalApproved: z.boolean(),
  remarks: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
});

export const validateApprovalStatusBody = (body: unknown) => {
  return approvalStatusUpdateSchema.parse(body);
};

export interface ApprovalStatusDto {
  approvalId: string;
  studentId: string;
  approvalStatus: string;
  vpaaApproved: boolean;
  finalApproved: boolean;
  vpaaApprovedAt: string | null;
  finalApprovedAt: string | null;
  remarks: string | null;
}

export const upsertApprovalStatusForStudent = async (
  studentId: string,
  input: z.infer<typeof approvalStatusUpdateSchema>
): Promise<ApprovalStatusDto> => {
  const client = await dbPool.connect();

  try {
    const query = `
      INSERT INTO approval_status (
        approval_id,
        student_id,
        approval_status,
        vpaa_approved,
        final_approved,
        vpaa_approved_at,
        final_approved_at,
        remarks
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2::approval_status_enum,
        $3,
        $4,
        CASE WHEN $3 THEN NOW() ELSE NULL END,
        CASE WHEN $4 THEN NOW() ELSE NULL END,
        $5
      )
      ON CONFLICT (student_id)
      DO UPDATE SET
        approval_status = EXCLUDED.approval_status,
        vpaa_approved = EXCLUDED.vpaa_approved,
        final_approved = EXCLUDED.final_approved,
        vpaa_approved_at = EXCLUDED.vpaa_approved_at,
        final_approved_at = EXCLUDED.final_approved_at,
        remarks = EXCLUDED.remarks,
        updated_at = NOW()
      RETURNING
        approval_id,
        student_id,
        approval_status,
        vpaa_approved,
        final_approved,
        vpaa_approved_at,
        final_approved_at,
        remarks;
    `;

    const result = await client.query(query, [
      studentId,
      input.approvalStatus,
      input.vpaaApproved,
      input.finalApproved,
      input.remarks ?? null
    ]);

    const row = result.rows[0];

    return {
      approvalId: row.approval_id,
      studentId: row.student_id,
      approvalStatus: row.approval_status,
      vpaaApproved: row.vpaa_approved,
      finalApproved: row.final_approved,
      vpaaApprovedAt: row.vpaa_approved_at,
      finalApprovedAt: row.final_approved_at,
      remarks: row.remarks
    };
  } finally {
    client.release();
  }
};

