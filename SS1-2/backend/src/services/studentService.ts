import { z } from "zod";
import { dbPool } from "../config/db";

const studentNumberSchema = z
  .string()
  .regex(/^[0-9]{9}$/, "studentNumber must be exactly 9 digits");

export const validateStudentNumber = (value: unknown): string => {
  return studentNumberSchema.parse(value);
};

export interface StudentOverview {
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string | null;
  programName: string | null;
  departmentName: string | null;
  approvalStatus: string | null;
  vpaaApproved: boolean | null;
  finalApproved: boolean | null;
  remarks: string | null;
  awards: string[];
}

export const getStudentOverviewByStudentNumber = async (
  studentNumber: string
): Promise<StudentOverview | null> => {
  const client = await dbPool.connect();
  try {
    const query = `
      SELECT
        s.student_id,
        s.student_number,
        s.first_name,
        s.last_name,
        s.email,
        s.enrollment_date,
        p.program_name,
        d.department_name,
        a.approval_status,
        a.vpaa_approved,
        a.final_approved,
        a.remarks,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT aw.award_name), NULL) AS awards
      FROM student s
      LEFT JOIN program p ON p.program_id = s.program_id
      LEFT JOIN department d ON d.department_id = p.department_id
      LEFT JOIN approval_status a ON a.student_id = s.student_id
      LEFT JOIN student_award sa ON sa.student_id = s.student_id
      LEFT JOIN award aw ON aw.award_id = sa.award_id
      WHERE s.student_number = $1
      GROUP BY
        s.student_id,
        s.student_number,
        s.first_name,
        s.last_name,
        s.email,
        s.enrollment_date,
        p.program_name,
        d.department_name,
        a.approval_status,
        a.vpaa_approved,
        a.final_approved,
        a.remarks
    `;
    const result = await client.query(query, [studentNumber]);
    const row = result.rows[0];
    if (!row) return null;

    return {
      studentId: row.student_id,
      studentNumber: row.student_number,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      enrollmentDate: row.enrollment_date,
      programName: row.program_name,
      departmentName: row.department_name,
      approvalStatus: row.approval_status,
      vpaaApproved: row.vpaa_approved,
      finalApproved: row.final_approved,
      remarks: row.remarks,
      awards: row.awards ?? []
    };
  } finally {
    client.release();
  }
};

// For now, details == overview; you can extend later.
export const getStudentDetailsByStudentNumber = getStudentOverviewByStudentNumber;