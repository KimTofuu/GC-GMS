"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { collegeOptions, collegeProgramMap, getProgramAbbreviation } from "./mock-data";

type CollegeProgramFiltersProps = {
  selectedCollegeLabel: string;
  selectedProgramLabel: string;
  initialCollege?: string;
  initialProgram?: string;
};

export default function CollegeProgramFilters({
  selectedCollegeLabel,
  selectedProgramLabel,
  initialCollege,
  initialProgram,
}: CollegeProgramFiltersProps) {
  const fallbackCollege = collegeOptions[0] ?? "";
  const safeInitialCollege = initialCollege && collegeProgramMap[initialCollege] ? initialCollege : fallbackCollege;

  const [selectedCollege, setSelectedCollege] = useState(safeInitialCollege);

  const programChoices = useMemo(() => {
    if (!selectedCollege) {
      return [];
    }

    return collegeProgramMap[selectedCollege] ?? [];
  }, [selectedCollege]);

  const safeInitialProgram =
    initialProgram && programChoices.includes(initialProgram)
      ? initialProgram
      : (programChoices[0] ?? "");

  const [selectedProgram, setSelectedProgram] = useState(safeInitialProgram);

  useEffect(() => {
    setSelectedProgram((previousProgram) => {
      if (programChoices.includes(previousProgram)) {
        return previousProgram;
      }

      return programChoices[0] ?? "";
    });
  }, [programChoices]);

  const [openDropdown, setOpenDropdown] = useState<"college" | "program" | null>(null);
  const toolbarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && toolbarRef.current?.contains(target)) {
        return;
      }

      setOpenDropdown(null);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <section ref={toolbarRef} className="checklist-toolbar" aria-label="Checklist Filters">
      <div className="checklist-select-wrap">
        <span className="sr-only">{selectedCollegeLabel}</span>

        <button
          type="button"
          className="checklist-select checklist-select-button"
          onClick={(event) => {
            event.stopPropagation();
            setOpenDropdown((previous) => (previous === "college" ? null : "college"));
          }}
          aria-haspopup="listbox"
          aria-expanded={openDropdown === "college"}
        >
          {selectedCollege}
        </button>

        {openDropdown === "college" && (
          <div className="checklist-dropdown-list" role="listbox" aria-label={selectedCollegeLabel}>
          {collegeOptions.map((college) => (
            <button
              key={college}
              type="button"
              className={`checklist-dropdown-item ${selectedCollege === college ? "active" : ""}`.trim()}
              onClick={() => {
                setSelectedCollege(college);
                setOpenDropdown(null);
              }}
            >
              {college}
            </button>
          ))}
          </div>
        )}
      </div>

      <div className="checklist-select-wrap small">
        <span className="sr-only">{selectedProgramLabel}</span>

        <button
          type="button"
          className="checklist-select checklist-select-button"
          onClick={(event) => {
            event.stopPropagation();
            setOpenDropdown((previous) => (previous === "program" ? null : "program"));
          }}
          aria-haspopup="listbox"
          aria-expanded={openDropdown === "program"}
        >
          {selectedProgram ? getProgramAbbreviation(selectedProgram) : "Select Program"}
        </button>

        {openDropdown === "program" && (
          <div className="checklist-dropdown-list" role="listbox" aria-label={selectedProgramLabel}>
          {programChoices.map((program) => (
            <button
              key={program}
              type="button"
              className={`checklist-dropdown-item ${selectedProgram === program ? "active" : ""}`.trim()}
              onClick={() => {
                setSelectedProgram(program);
                setOpenDropdown(null);
              }}
            >
              {getProgramAbbreviation(program)}
            </button>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
