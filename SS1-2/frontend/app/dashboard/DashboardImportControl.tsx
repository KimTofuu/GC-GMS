"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ParsedCsvResult = {
  headers: string[];
  rows: Record<string, string>[];
};

const IMPORT_STORAGE_KEY = "gc-gms-imported-students";

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(content: string): ParsedCsvResult {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV file must include a header row and at least one data row.");
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headers = rawHeaders.map(normalizeHeader);

  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = (cells[index] ?? "").trim();
    });

    return row;
  });

  return { headers, rows };
}

function validateCsvData(result: ParsedCsvResult): { rowCount: number } {
  const requiredHeaderGroups = [
    ["student_id", "id"],
    ["full_name", "name", "student_name"],
    ["email"],
    ["program", "course"],
  ];

  const missingGroups = requiredHeaderGroups.filter(
    (group) => !group.some((header) => result.headers.includes(header))
  );

  if (missingGroups.length > 0) {
    throw new Error(
      "CSV is missing required columns. Include at least: student_id (or id), full_name (or name), email, and program."
    );
  }

  return { rowCount: result.rows.length };
}

export default function DashboardImportControl() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedFileName = useMemo(() => selectedFile?.name ?? "No file selected", [selectedFile]);

  const openModal = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setErrorMessage(null);
  };

  const onImport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please choose a CSV file first.");
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const content = await selectedFile.text();
      const parsed = parseCsv(content);
      const { rowCount } = validateCsvData(parsed);

      window.localStorage.setItem(IMPORT_STORAGE_KEY, JSON.stringify(parsed.rows));

      setSuccessMessage(`Imported ${rowCount} student${rowCount === 1 ? "" : "s"} successfully.`);
      setSelectedFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to import CSV file.";
      setErrorMessage(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <button type="button" className="dashboard-import-btn" aria-label="Import students" onClick={openModal}>
        <i className="fa-solid fa-file-arrow-up" aria-hidden />
        Import
      </button>

      {isModalOpen && (
        <div className="dashboard-import-backdrop" role="presentation">
          <div className="dashboard-import-modal" role="dialog" aria-modal="true" aria-label="Import students">
            <h3>Import Student List</h3>

            <form onSubmit={onImport} className="dashboard-import-form">
              <input id="student-csv" type="file" accept=".csv,text/csv" onChange={onFileChange} />
              <p className="dashboard-import-file">{selectedFileName}</p>

              {errorMessage && <p className="dashboard-import-error">{errorMessage}</p>}
              {successMessage && <p className="dashboard-import-success">{successMessage}</p>}

              <div className="dashboard-import-actions">
                <button type="button" className="dashboard-modal-btn neutral" onClick={closeModal}>
                  Close
                </button>
                <button type="submit" className="dashboard-modal-btn success" disabled={isImporting}>
                  {isImporting ? "Importing..." : "Import File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
