"use client";

import { FormEvent, useState } from "react";

type AchievementListManagerProps = {
  initialAchievements: string[];
};

export default function AchievementListManager({
  initialAchievements,
}: AchievementListManagerProps) {
  const [achievements, setAchievements] = useState<string[]>(initialAchievements);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAchievementName, setNewAchievementName] = useState("");
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

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
    </section>
  );
}
