"use client";

import { useMemo, useState } from "react";
import ChecklistStudentTable from "./ChecklistStudentTable";
import CollegeProgramFilters from "./CollegeProgramFilters";
import { students } from "./mock-data";
import "./checklist.css";

export default function ChecklistPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const enrolledCount = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return students.length;
    }

    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.email.toLowerCase().includes(normalizedQuery) ||
        student.id.toLowerCase().includes(normalizedQuery)
      );
    }).length;
  }, [searchQuery]);

  return (
    <main className="dashboard-main checklist-page">
      <h1 className="dashboard-heading">Checklist</h1>

      <CollegeProgramFilters
        selectedCollegeLabel="Select College"
        selectedProgramLabel="Select Program"
        initialCollege="College of Computer Studies (CCS)"
        initialProgram="Bachelor of Science in Information Technology"
      />

      <section className="checklist-board" aria-label="Student Checklist">
        <header className="checklist-board-header">
          <div>
            <h2>BS Information Technology</h2>
            <p>
              {enrolledCount} {enrolledCount === 1 ? "student" : "students"} enrolled
            </p>
          </div>

          <label className="checklist-search" aria-label="Search students">
            <i className="fa-solid fa-magnifying-glass" aria-hidden />
            <input
              type="search"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </header>

        <ChecklistStudentTable searchQuery={searchQuery} />
      </section>
    </main>
  );
}
