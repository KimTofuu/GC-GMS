"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CHECKLIST_PROGRESS_UPDATED_EVENT,
  deriveChecklistStatus,
  getApprovalForSlug,
  getCompletionSummary,
  getRequirementsForSlug,
} from "./progress-storage";
import { getAllStudentDetails, students } from "./mock-data";

const statusConfig = {
  incomplete: { label: "INCOMPLETE", iconClass: "fa-solid fa-xmark" },
  pending: { label: "PENDING", iconClass: "fa-regular fa-clock" },
  approved: { label: "APPROVED", iconClass: "fa-solid fa-check" },
};

const detailsBySlug = new Map(
  getAllStudentDetails().map((detail) => [detail.student.slug, detail] as const)
);

type StudentProgress = {
  completedRequirements: number;
  totalRequirements: number;
  completionRate: number;
  status: "incomplete" | "pending" | "approved";
};

type ChecklistStudentTableProps = {
  searchQuery: string;
};

export default function ChecklistStudentTable({ searchQuery }: ChecklistStudentTableProps) {
  const [progressBySlug, setProgressBySlug] = useState<Record<string, StudentProgress>>({});

  const computeProgress = useCallback(() => {
    const computed = students.reduce<Record<string, StudentProgress>>((acc, student) => {
      const detail = detailsBySlug.get(student.slug);

      if (!detail) {
        const fallbackCompletionRate =
          student.totalRequirements > 0
            ? (student.completedRequirements / student.totalRequirements) * 100
            : 0;

        acc[student.slug] = {
          completedRequirements: student.completedRequirements,
          totalRequirements: student.totalRequirements,
          completionRate: fallbackCompletionRate,
          status: deriveChecklistStatus(fallbackCompletionRate, student.status === "approved"),
        };
        return acc;
      }

      const syncedRequirements = getRequirementsForSlug(student.slug, detail.requirements);
      const summary = getCompletionSummary(syncedRequirements);
      const approved = getApprovalForSlug(student.slug, detail.student.status === "approved");

      acc[student.slug] = {
        completedRequirements: summary.completedRequirements,
        totalRequirements: summary.totalRequirements,
        completionRate: summary.completionRate,
        status: deriveChecklistStatus(summary.completionRate, approved),
      };
      return acc;
    }, {});

    setProgressBySlug(computed);
  }, []);

  useEffect(() => {
    computeProgress();

    const handleProgressUpdate = () => computeProgress();

    window.addEventListener(CHECKLIST_PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    window.addEventListener("storage", handleProgressUpdate);

    return () => {
      window.removeEventListener(CHECKLIST_PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      window.removeEventListener("storage", handleProgressUpdate);
    };
  }, [computeProgress]);

  const rows = useMemo(
    () =>
      students.map((student) => {
        const progress = progressBySlug[student.slug];

        return {
          ...student,
          completedRequirements: progress?.completedRequirements ?? student.completedRequirements,
          totalRequirements: progress?.totalRequirements ?? student.totalRequirements,
          completionRate:
            progress?.completionRate ??
            (student.totalRequirements > 0
              ? (student.completedRequirements / student.totalRequirements) * 100
              : 0),
          status: progress?.status ?? student.status,
        };
      }),
    [progressBySlug]
  );

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((student) => {
      return (
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.email.toLowerCase().includes(normalizedQuery) ||
        student.id.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [rows, searchQuery]);

  return (
    <div className="checklist-table-wrap" role="region" aria-label="Student list">
      <table className="checklist-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>ID</th>
            <th>Requirements</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((student) => {
            const status = statusConfig[student.status];

            return (
              <tr key={student.id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar" aria-hidden>
                      <i className="fa-regular fa-user" />
                    </div>

                    <div className="student-meta">
                      <Link href={`/checklist/${student.slug}`}>{student.name}</Link>
                      <p>{student.email}</p>
                    </div>
                  </div>
                </td>
                <td>{student.id}</td>
                <td>
                  <div className="requirement-cell">
                    <div className="requirements-track" aria-hidden>
                      <span style={{ width: `${student.completionRate}%` }} />
                    </div>
                    <strong>
                      {student.completedRequirements}/{student.totalRequirements}
                    </strong>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${student.status}`.trim()}>
                    <i className={status.iconClass} aria-hidden />
                    {status.label}
                  </span>
                </td>
                <td>
                  <Link
                    className="action-dots"
                    href={`/checklist/${student.slug}`}
                    aria-label="View student details"
                  >
                    <i className="fa-solid fa-ellipsis" aria-hidden />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
