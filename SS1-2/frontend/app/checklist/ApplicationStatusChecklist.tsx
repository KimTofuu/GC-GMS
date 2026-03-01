"use client";

import { useMemo, useState } from "react";
import type { Requirement } from "./mock-data";
import {
  getRequirementsForSlug,
  saveRequirementsForSlug,
} from "./progress-storage";

type ApplicationStatusChecklistProps = {
  studentSlug: string;
  initialRequirements: Requirement[];
};

export default function ApplicationStatusChecklist({
  studentSlug,
  initialRequirements,
}: ApplicationStatusChecklistProps) {
  const [requirements, setRequirements] = useState<Requirement[]>(() =>
    getRequirementsForSlug(studentSlug, initialRequirements)
  );

  const completedRequirements = useMemo(
    () => requirements.filter((item) => item.complete).length,
    [requirements]
  );
  const totalRequirements = requirements.length;
  const completionRate = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0;

  const toggleRequirement = (targetIndex: number) => {
    setRequirements((previous) => {
      const updated = previous.map((item, index) => {
        if (index !== targetIndex) {
          return item;
        }

        return {
          ...item,
          complete: !item.complete,
        };
      });

      saveRequirementsForSlug(studentSlug, updated);
      return updated;
    });
  };

  return (
    <>
      <div className="application-progress">
        <div className="requirements-track" aria-hidden>
          <span style={{ width: `${completionRate}%` }} />
        </div>
        <strong>
          {completedRequirements}/{totalRequirements}
        </strong>
      </div>

      <div className="requirement-list" role="list" aria-label="Document requirements">
        {requirements.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`requirement-item ${item.complete ? "complete" : "incomplete"}`.trim()}
            role="listitem"
            onClick={() => toggleRequirement(index)}
            aria-pressed={item.complete}
          >
            <span className="item-check" aria-hidden>
              <i className="fa-solid fa-check" />
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
