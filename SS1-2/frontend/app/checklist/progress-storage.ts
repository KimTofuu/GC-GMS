import type { Requirement } from "./mock-data";

const STORAGE_KEY = "gc-gms-checklist-progress-v1";
export const CHECKLIST_PROGRESS_UPDATED_EVENT = "gc-gms-checklist-progress-updated";

type StudentProgressEntry = {
  requirements: boolean[];
  achievements: string[];
  approved: boolean;
};

type ProgressStore = Record<string, StudentProgressEntry>;

function parseStore(rawValue: string | null): ProgressStore {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const asRecord = parsed as Record<string, unknown>;
    const normalized: ProgressStore = {};

    Object.entries(asRecord).forEach(([slug, value]) => {
      if (Array.isArray(value)) {
        normalized[slug] = {
          requirements: value.map((item) => Boolean(item)),
          achievements: [],
          approved: false,
        };
        return;
      }

      if (value && typeof value === "object") {
        const entry = value as Record<string, unknown>;
        const requirements = Array.isArray(entry.requirements)
          ? entry.requirements.map((item) => Boolean(item))
          : [];
        const achievements = Array.isArray(entry.achievements)
          ? entry.achievements
              .map((item) => (typeof item === "string" ? item.trim() : ""))
              .filter((item) => item.length > 0)
          : [];
        const approved = Boolean(entry.approved);

        normalized[slug] = {
          requirements,
          achievements,
          approved,
        };
      }
    });

    return normalized;
  } catch {
    return {};
  }
}

function readStore(): ProgressStore {
  if (typeof window === "undefined") {
    return {};
  }

  return parseStore(window.localStorage.getItem(STORAGE_KEY));
}

function writeStore(store: ProgressStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(CHECKLIST_PROGRESS_UPDATED_EVENT));
}

export function getRequirementsForSlug(slug: string, baseRequirements: Requirement[]): Requirement[] {
  const store = readStore();
  const savedCompletion = store[slug]?.requirements;

  if (!savedCompletion || savedCompletion.length === 0) {
    return baseRequirements;
  }

  return baseRequirements.map((item, index) => ({
    ...item,
    complete: savedCompletion[index] ?? item.complete,
  }));
}

export function saveRequirementsForSlug(slug: string, requirements: Requirement[]) {
  const store = readStore();
  const previous = store[slug];

  store[slug] = {
    requirements: requirements.map((item) => item.complete),
    achievements: previous?.achievements ?? [],
    approved: previous?.approved ?? false,
  };
  writeStore(store);
}

export function getAchievementsForSlug(slug: string, baseAchievements: string[]): string[] {
  const store = readStore();
  const savedAchievements = store[slug]?.achievements;

  if (!savedAchievements || savedAchievements.length === 0) {
    return baseAchievements;
  }

  return savedAchievements;
}

export function saveAchievementsForSlug(slug: string, achievements: string[]) {
  const store = readStore();
  const previous = store[slug];

  store[slug] = {
    requirements: previous?.requirements ?? [],
    achievements,
    approved: previous?.approved ?? false,
  };

  writeStore(store);
}

export function getApprovalForSlug(slug: string, baseApproved: boolean): boolean {
  const store = readStore();
  const storedApproved = store[slug]?.approved;

  if (typeof storedApproved === "boolean") {
    return storedApproved;
  }

  return baseApproved;
}

export function saveApprovalForSlug(slug: string, approved: boolean) {
  const store = readStore();
  const previous = store[slug];

  store[slug] = {
    requirements: previous?.requirements ?? [],
    achievements: previous?.achievements ?? [],
    approved,
  };

  writeStore(store);
}

export type ComputedChecklistStatus = "incomplete" | "pending" | "approved";

export function deriveChecklistStatus(
  completionRate: number,
  isApproved: boolean
): ComputedChecklistStatus {
  if (completionRate < 100) {
    return "incomplete";
  }

  if (isApproved) {
    return "approved";
  }

  return "pending";
}

export function getCompletionSummary(requirements: Requirement[]) {
  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter((item) => item.complete).length;
  const completionRate = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0;

  return {
    totalRequirements,
    completedRequirements,
    completionRate,
  };
}
