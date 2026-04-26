import type { RuleEvaluation } from "./rules";
import type { RecommendationCategory, DataConfidence, MatchStrength } from "./types";
import { CATEGORY_WEIGHTS, MATCH_STRENGTH_THRESHOLDS } from "./scoringConstants";

// ── Category-aware weighted score ─────────────────────────────────────────────
//
// No hard 100 cap here. The raw score can exceed 100 when a player triggers
// multiple bonuses. The 0–100 normalization is applied at the category level
// in the engine (min-max across the candidate set) so ranking signal is
// preserved even when items bunch near the old ceiling.

export function weightedScore(
  evaluation: RuleEvaluation,
  category: RecommendationCategory,
): number {
  const w = CATEGORY_WEIGHTS[category === "irons" ? "iron" : category];

  return (
    evaluation.distance * w.distance +
    evaluation.dispersion * w.dispersion +
    evaluation.launchSpin * w.launchSpin +
    evaluation.feel * w.feel +
    evaluation.forgiveness * w.forgiveness
  );
}

// ── Min-max normalization ─────────────────────────────────────────────────────
//
// Applied once per category across all candidates so that the spread between
// the best and worst match is always mapped to the full 0–100 range.

export function minMaxNormalize(scores: number[]): number[] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max === min) return scores.map(() => 50); // all identical → neutral
  return scores.map((s) => Math.round(((s - min) / (max - min)) * 100));
}

// ── Data confidence ───────────────────────────────────────────────────────────
//
// Reflects how complete the player's input is — independent of match quality.

export function computeDataConfidence(
  launchData: Record<string, unknown>,
): DataConfidence {
  const hasLaunch = Object.values(launchData).some(
    (v) => v !== undefined && v !== null && v !== "",
  );
  if (!hasLaunch) return "profile_only";
  return "profile_and_launch";
}

// ── Match strength ────────────────────────────────────────────────────────────
//
// Reflects how well the top pick scored relative to the rest of the field.
// Uses the normalized top score; a higher score means the top pick stood out.

export function computeMatchStrength(normalizedTopScore: number): MatchStrength {
  const ratio = normalizedTopScore / 100;
  if (ratio >= MATCH_STRENGTH_THRESHOLDS.STRONG) return "strong";
  if (ratio >= MATCH_STRENGTH_THRESHOLDS.MODERATE) return "moderate";
  return "weak";
}

// ── Confidence summary sentence ───────────────────────────────────────────────

export function buildConfidenceSummary(
  dataConfidence: DataConfidence,
  matchStrength: MatchStrength,
): string {
  const strengthLabel =
    matchStrength === "strong"
      ? "Strong match"
      : matchStrength === "moderate"
        ? "Moderate match"
        : "Weak match";

  if (dataConfidence === "profile_and_launch") {
    return `${strengthLabel} based on profile and launch data.`;
  }
  return `${strengthLabel} based on profile only — add launch monitor data to validate.`;
}

// ── Legacy confidence label ───────────────────────────────────────────────────
//
// Retained for session-history backward compatibility. Derived from matchStrength
// so it no longer conflates data completeness with match quality.

export function matchStrengthToLegacyConfidence(
  ms: MatchStrength,
): "High" | "Medium" | "Low" {
  if (ms === "strong") return "High";
  if (ms === "moderate") return "Medium";
  return "Low";
}

// ── Weights export (for tests) ────────────────────────────────────────────────
export { CATEGORY_WEIGHTS };
