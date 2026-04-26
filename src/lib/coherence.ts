/**
 * BUILD COHERENCE VALIDATOR
 *
 * After the top candidate is selected per category, this pass checks for known
 * bad equipment combinations (e.g. low-spin driver + low-spin ball + heavy shaft
 * to the same player).  If a conflict is detected the #2 pick for the offending
 * category is swapped in and the check re-runs — up to one swap per category.
 *
 * Every swap is surfaced in the recommendation's `swappedForCoherence` flag and
 * a corresponding reason is appended so the UI can explain the decision.
 */

import type { ScoredRecommendation } from "./types";

export interface BuildCandidates {
  driver: ScoredRecommendation[];
  shaft: ScoredRecommendation[];
  ball: ScoredRecommendation[];
  iron: ScoredRecommendation[];
}

export interface CoherentBuild {
  driver: ScoredRecommendation;
  shaft: ScoredRecommendation;
  ball: ScoredRecommendation;
  iron: ScoredRecommendation;
}

// ── Conflict definitions ──────────────────────────────────────────────────────

interface ConflictCheck {
  id: string;
  description: string;
  /** Returns true when the build has a problem. */
  detect: (build: CoherentBuild) => boolean;
  /** Which category to swap when the conflict is detected. */
  swapCategory: keyof CoherentBuild;
  swapReason: string;
}

const CONFLICTS: ConflictCheck[] = [
  {
    id: "C-1",
    description: "All-low-spin stack: low-spin driver + low-spin ball",
    detect: (b) =>
      b.driver.components.launchSpin < 50 && b.ball.components.launchSpin < 50,
    swapCategory: "ball",
    swapReason:
      "Swapped to #2 ball pick to avoid all-low-spin stack with selected driver.",
  },
  {
    id: "C-2",
    description: "All-high-launch stack: high-launch driver + high-launch shaft",
    detect: (b) =>
      b.driver.components.launchSpin > 65 && b.shaft.components.launchSpin > 65,
    swapCategory: "shaft",
    swapReason:
      "Swapped to #2 shaft pick to balance high-launch driver in the build.",
  },
  {
    id: "C-3",
    description: "Heavy shaft penalty already fired on shaft but shaft is still #1",
    detect: (b) =>
      b.shaft.reasons.some((r) => r.toLowerCase().includes("heavy shaft will reduce control")),
    swapCategory: "shaft",
    swapReason:
      "Swapped to #2 shaft pick — selected shaft flagged as poor tempo/speed match.",
  },
  {
    id: "C-4",
    description: "Draw-biased driver penalised for left miss still picked #1",
    detect: (b) =>
      b.driver.reasons.some((r) => r.toLowerCase().includes("draw-bias driver would worsen")),
    swapCategory: "driver",
    swapReason:
      "Swapped to #2 driver pick — draw-bias head flagged as mismatch for left miss tendency.",
  },
];

// ── Validator ─────────────────────────────────────────────────────────────────

function pickAt(candidates: ScoredRecommendation[], idx: number): ScoredRecommendation {
  return candidates[idx] ?? candidates[0];
}

export function validateBuildCoherence(candidates: BuildCandidates): CoherentBuild {
  let build: CoherentBuild = {
    driver: pickAt(candidates.driver, 0),
    shaft: pickAt(candidates.shaft, 0),
    ball: pickAt(candidates.ball, 0),
    iron: pickAt(candidates.iron, 0),
  };

  // Allow one swap per category — track which have already been swapped.
  const swapped = new Set<keyof CoherentBuild>();

  for (const conflict of CONFLICTS) {
    if (!conflict.detect(build)) continue;

    const cat = conflict.swapCategory;
    if (swapped.has(cat)) continue; // already swapped this category, skip

    const idx1 = candidates[cat].findIndex((r) => r.id === build[cat].id);
    const nextIdx = idx1 === 0 ? 1 : 0; // try the other top pick
    const next = candidates[cat][nextIdx];
    if (!next) continue; // only one candidate in catalog, nothing to swap

    build = {
      ...build,
      [cat]: {
        ...next,
        swappedForCoherence: true,
        reasons: [...next.reasons, conflict.swapReason],
      },
    };
    swapped.add(cat);
  }

  return build;
}
