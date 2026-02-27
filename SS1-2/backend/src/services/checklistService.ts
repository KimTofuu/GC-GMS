import { z } from "zod";
import { dbPool } from "../config/db";

const studentIdSchema = z.string().uuid();

export const validateStudentId = (value: unknown): string => {
  return studentIdSchema.parse(value);
};

const checklistItemUpdateSchema = z.object({
  documentTypeId: z.string().uuid(),
  status: z.enum(["PENDING", "SUBMITTED", "APPROVED", "REJECTED"]),
  remarks: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
});

export const validateChecklistUpdateBody = (body: unknown) => {
  const schema = z.object({
    items: z.array(checklistItemUpdateSchema).min(1)
  });

  return schema.parse(body);
};

export interface ChecklistItem {
  documentTypeId: string;
  code: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  status: string;
  studentDocumentId: string | null;
  fileUrl: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  remarks: string | null;
}

interface ChecklistRow {
  document_type_id: string;
  code: string;
  name: string;
  description: string | null;
  is_required: boolean;
  status: string;
  student_document_id: string | null;
  file_url: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  remarks: string | null;
}

export const getChecklistForStudent = async (
  studentId: string
): Promise<ChecklistItem[]> => {
  const client = await dbPool.connect();

  try {
    const query = `
      SELECT
        dt.document_type_id,
        dt.code,
        dt.name,
        dt.description,
        dt.is_required,
        sd.student_document_id,
        COALESCE(sd.status::text, 'PENDING') AS status,
        sd.file_url,
        sd.submitted_at,
        sd.verified_at,
        sd.remarks
      FROM document_type dt
      LEFT JOIN student_document sd
        ON sd.document_type_id = dt.document_type_id
       AND sd.student_id = $1
      ORDER BY dt.name;
    `;

    const result = await client.query(query, [studentId]);

    const rows = result.rows as ChecklistRow[];

    return rows.map((row) => ({
      documentTypeId: row.document_type_id,
      code: row.code,
      name: row.name,
      description: row.description,
      isRequired: row.is_required,
      status: row.status,
      studentDocumentId: row.student_document_id ?? null,
      fileUrl: row.file_url ?? null,
      submittedAt: row.submitted_at,
      verifiedAt: row.verified_at,
      remarks: row.remarks ?? null
    }));
  } finally {
    client.release();
  }
};

interface ChecklistUpdateItem {
  documentTypeId: string;
  status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";
  remarks?: string | null;
}

export const updateChecklistForStudent = async (
  studentId: string,
  items: ChecklistUpdateItem[]
): Promise<ChecklistItem[]> => {
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");

    const upsertQuery = `
      INSERT INTO student_document (
        student_document_id,
        student_id,
        document_type_id,
        status,
        remarks,
        submitted_at,
        verified_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3::document_status_enum,
        $4,
        CASE
          WHEN $3 IN ('SUBMITTED', 'APPROVED', 'REJECTED') THEN NOW()
          ELSE NULL
        END,
        CASE
          WHEN $3 IN ('APPROVED', 'REJECTED') THEN NOW()
          ELSE NULL
        END
      )
      ON CONFLICT (student_id, document_type_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        remarks = EXCLUDED.remarks,
        submitted_at = EXCLUDED.submitted_at,
        verified_at = EXCLUDED.verified_at,
        updated_at = NOW();
    `;

    for (const item of items) {
      await client.query(upsertQuery, [
        studentId,
        item.documentTypeId,
        item.status,
        item.remarks ?? null
      ]);
    }

    await client.query("COMMIT");

    // Return the updated checklist
    const updated = await getChecklistForStudent(studentId);
    return updated;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

