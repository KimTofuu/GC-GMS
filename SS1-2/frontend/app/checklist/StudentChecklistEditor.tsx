"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CollegeProgramFilters from "./CollegeProgramFilters";
import type { StudentDetail } from "./mock-data";
import {
  deriveChecklistStatus,
  getApprovalForSlug,
  getAchievementsForSlug,
  getCompletionSummary,
  getRequirementsForSlug,
  saveApprovalForSlug,
  saveAchievementsForSlug,
  saveRequirementsForSlug,
} from "./progress-storage";

type StudentChecklistEditorProps = {
  detail: StudentDetail;
};

const statusConfig = {
  incomplete: { label: "INCOMPLETE", iconClass: "fa-solid fa-xmark" },
  pending: { label: "PENDING", iconClass: "fa-regular fa-clock" },
  approved: { label: "APPROVED", iconClass: "fa-solid fa-check" },
};

function areRequirementsEqual(a: { complete: boolean }[], b: { complete: boolean }[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((item, index) => item.complete === b[index]?.complete);
}

function areAchievementsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((item, index) => item === b[index]);
}

export default function StudentChecklistEditor({ detail }: StudentChecklistEditorProps) {
  const router = useRouter();

  const [requirements, setRequirements] = useState(detail.requirements);
  const [achievements, setAchievements] = useState(detail.achievements);
  const [isApproved, setIsApproved] = useState(detail.student.status === "approved");

  const [savedRequirements, setSavedRequirements] = useState(detail.requirements);
  const [savedAchievements, setSavedAchievements] = useState(detail.achievements);
  const [savedApproved, setSavedApproved] = useState(detail.student.status === "approved");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAchievementName, setNewAchievementName] = useState("");
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
  const [saveConfirmationMessage, setSaveConfirmationMessage] = useState(
    "Your updates were saved successfully."
  );
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  useEffect(() => {
    const storedRequirements = getRequirementsForSlug(detail.student.slug, detail.requirements);
    const storedAchievements = getAchievementsForSlug(detail.student.slug, detail.achievements);
    const storedApproval = getApprovalForSlug(detail.student.slug, detail.student.status === "approved");

    setRequirements(storedRequirements);
    setSavedRequirements(storedRequirements);

    setAchievements(storedAchievements);
    setSavedAchievements(storedAchievements);

    setIsApproved(storedApproval);
    setSavedApproved(storedApproval);
  }, [detail.achievements, detail.requirements, detail.student.slug, detail.student.status]);

  const summary = useMemo(() => getCompletionSummary(requirements), [requirements]);
  const derivedStatus = useMemo(
    () => deriveChecklistStatus(summary.completionRate, isApproved),
    [isApproved, summary.completionRate]
  );
  const status = statusConfig[derivedStatus];

  useEffect(() => {
    if (summary.completionRate < 100 && isApproved) {
      setIsApproved(false);
    }
  }, [isApproved, summary.completionRate]);

  const hasUnsavedChanges = useMemo(() => {
    return (
      !areRequirementsEqual(requirements, savedRequirements) ||
      !areAchievementsEqual(achievements, savedAchievements) ||
      isApproved !== savedApproved
    );
  }, [achievements, isApproved, requirements, savedAchievements, savedApproved, savedRequirements]);

  const persistChanges = ({
    approved,
    confirmationMessage,
    showConfirmation = true,
  }: {
    approved: boolean;
    confirmationMessage?: string;
    showConfirmation?: boolean;
  }) => {
    saveRequirementsForSlug(detail.student.slug, requirements);
    saveAchievementsForSlug(detail.student.slug, achievements);
    saveApprovalForSlug(detail.student.slug, approved);

    setSavedRequirements(requirements);
    setSavedAchievements(achievements);
    setSavedApproved(approved);
    setIsApproved(approved);

    if (showConfirmation) {
      setSaveConfirmationMessage(confirmationMessage ?? "Your updates were saved successfully.");
      setIsSaveConfirmationOpen(true);
    }
  };

  const handleSaveChanges = () => {
    persistChanges({ approved: isApproved, showConfirmation: true });
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedModalOpen(true);
      return;
    }

    router.push("/checklist");
  };

  const discardAndGoBack = () => {
    setIsUnsavedModalOpen(false);
    router.push("/checklist");
  };

  const saveAndGoBack = () => {
    persistChanges({ approved: isApproved, showConfirmation: false });
    setIsUnsavedModalOpen(false);
    router.push("/checklist");
  };

  const handleMarkAsApprovedClick = () => {
    setIsApproveConfirmOpen(true);
  };

  const confirmMarkAsApproved = () => {
    persistChanges({
      approved: true,
      showConfirmation: true,
      confirmationMessage: "Student was marked as approved.",
    });
    setIsApproveConfirmOpen(false);
  };

  const toggleRequirement = (targetIndex: number) => {
    setRequirements((previous) =>
      previous.map((item, index) => {
        if (index !== targetIndex) {
          return item;
        }

        return {
          ...item,
          complete: !item.complete,
        };
      })
    );
  };

  const openAddModal = () => {
    setNewAchievementName("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewAchievementName("");
  };

  const submitNewAchievement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newAchievementName.trim();
    if (!trimmedName) {
      return;
    }

    setAchievements((previous) => [...previous, trimmedName]);
    closeAddModal();
  };

  const openDeleteModal = (index: number) => {
    setDeleteTargetIndex(index);
  };

  const closeDeleteModal = () => {
    setDeleteTargetIndex(null);
  };

  const confirmDelete = () => {
    if (deleteTargetIndex === null) {
      return;
    }

    setAchievements((previous) => previous.filter((_, index) => index !== deleteTargetIndex));
    closeDeleteModal();
  };

  return (
    <>
      <div className="detail-top-row">
        <button type="button" className="back-link" onClick={handleBackClick}>
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Back to Student List
        </button>

        <CollegeProgramFilters
          selectedCollegeLabel="Selected college"
          selectedProgramLabel="Selected program"
          initialCollege="College of Computer Studies (CCS)"
          initialProgram="Bachelor of Science in Information Technology"
        />
      </div>

      <section className="detail-card" aria-label="Student information">
        <header className="detail-card-header">
          <i className="fa-regular fa-user" aria-hidden />
          <h2>Student Information</h2>
        </header>

        <div className="student-info-grid">
          <div className="student-large-avatar" aria-hidden>
            <i className="fa-regular fa-user" />
          </div>

          <div className="student-info-items">
            <p>
              <span>Full Name</span>
              {detail.student.name}
            </p>
            <p>
              <span>Student ID Number</span>
              {detail.student.id}
            </p>
            <p>
              <span>Email</span>
              {detail.student.email}
            </p>
            <p>
              <span>Program</span>
              {detail.student.program}
            </p>
          </div>
        </div>
      </section>

      <section className="detail-card" aria-label="Application status">
        <header className="detail-card-header split">
          <div className="title-wrap">
            <i className="fa-regular fa-file" aria-hidden />
            <h2>Application Status</h2>
          </div>

          <span className={`status-pill ${derivedStatus}`.trim()}>
            <i className={status.iconClass} aria-hidden />
            {status.label}
          </span>
        </header>

        <div className="application-progress">
          <div className="requirements-track" aria-hidden>
            <span style={{ width: `${summary.completionRate}%` }} />
          </div>
          <strong>
            {summary.completedRequirements}/{summary.totalRequirements}
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
      </section>

      <section className="detail-card" aria-label="Achievement list">
        <header className="detail-card-header split">
          <div className="title-wrap">
            <i className="fa-solid fa-award" aria-hidden />
            <h2>Achievement List</h2>
          </div>
          <button type="button" className="icon-circle-btn" aria-label="Add achievement" onClick={openAddModal}>
            <i className="fa-solid fa-plus" aria-hidden />
          </button>
        </header>

        <div className="achievement-grid">
          {achievements.map((achievement, index) => (
            <div key={`${achievement}-${index}`} className="achievement-pill">
              <i className="fa-solid fa-award" aria-hidden />
              <span>{achievement}</span>
              <button type="button" aria-label={`Remove ${achievement}`} onClick={() => openDeleteModal(index)}>
                <i className="fa-solid fa-minus" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-actions" aria-label="Student checklist actions">
        <button type="button" className="btn-outline-success" onClick={handleSaveChanges}>
          <i className="fa-regular fa-floppy-disk" aria-hidden />
          Save Changes
        </button>
        <button
          type="button"
          className="btn-success-solid"
          onClick={handleMarkAsApprovedClick}
          disabled={summary.completionRate < 100 || derivedStatus === "approved"}
        >
          <i className="fa-solid fa-check" aria-hidden />
          Mark as Approved
        </button>
      </section>

      {isAddModalOpen && (
        <div className="achievement-modal-backdrop" role="presentation">
          <div className="achievement-modal" role="dialog" aria-modal="true" aria-label="Add achievement">
            <h3>Add Achievement</h3>

            <form onSubmit={submitNewAchievement} className="achievement-modal-form">
              <label htmlFor="achievement-name">Achievement Name</label>
              <input
                id="achievement-name"
                type="text"
                value={newAchievementName}
                onChange={(event) => setNewAchievementName(event.target.value)}
                placeholder="Enter achievement name"
                autoFocus
                required
              />

              <div className="achievement-modal-actions">
                <button type="button" className="modal-btn neutral" onClick={closeAddModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn success">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTargetIndex !== null && (
        <div className="achievement-modal-backdrop" role="presentation">
          <div className="achievement-modal" role="dialog" aria-modal="true" aria-label="Delete achievement">
            <h3>Delete Achievement</h3>
            <p className="achievement-modal-text">Are you sure you want to remove this achievement?</p>

            <div className="achievement-modal-actions">
              <button type="button" className="modal-btn neutral" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button type="button" className="modal-btn danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isUnsavedModalOpen && (
        <div className="achievement-modal-backdrop" role="presentation">
          <div className="achievement-modal" role="dialog" aria-modal="true" aria-label="Unsaved changes">
            <h3>Unsaved Changes</h3>
            <p className="achievement-modal-text">
              You made changes to this student. Do you want to save them before going back to the
              student list?
            </p>

            <div className="achievement-modal-actions">
              <button type="button" className="modal-btn neutral" onClick={() => setIsUnsavedModalOpen(false)}>
                Stay
              </button>
              <button type="button" className="modal-btn danger" onClick={discardAndGoBack}>
                Don&apos;t Save
              </button>
              <button type="button" className="modal-btn success" onClick={saveAndGoBack}>
                Save and Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {isSaveConfirmationOpen && (
        <div className="achievement-modal-backdrop" role="presentation">
          <div className="achievement-modal" role="dialog" aria-modal="true" aria-label="Changes saved">
            <h3>Changes Saved</h3>
            <p className="achievement-modal-text">{saveConfirmationMessage}</p>

            <div className="achievement-modal-actions">
              <button
                type="button"
                className="modal-btn success"
                onClick={() => setIsSaveConfirmationOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isApproveConfirmOpen && (
        <div className="achievement-modal-backdrop" role="presentation">
          <div className="achievement-modal" role="dialog" aria-modal="true" aria-label="Approve student">
            <h3>Mark as Approved</h3>
            <p className="achievement-modal-text">
              Are you sure you want to mark this student as approved?
            </p>

            <div className="achievement-modal-actions">
              <button type="button" className="modal-btn neutral" onClick={() => setIsApproveConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" className="modal-btn success" onClick={confirmMarkAsApproved}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
