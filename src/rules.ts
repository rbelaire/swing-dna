/**
 * SCORING RULES
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DIMENSION OWNERSHIP TABLE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Each player↔equipment interaction fires in exactly ONE dimension.
 * If you want a trait to carry more weight, adjust CATEGORY_WEIGHTS in
 * scoringConstants.ts — do not re-fire the rule in a second dimension.
 *
 * ID     Condition                               Owner         Removed from
 * ─────  ─────────────────────────────────────── ───────────── ────────────
 * DR-1   spinRate > 3000 + low-spin driver        launchSpin    distance
 * DR-2   launchAngle < 10 + better-launch driver  launchSpin    (was single)
 * DR-3   right miss + draw-bias driver            dispersion    forgiveness
 * DR-4   consistency < 45 + high-MOI driver       forgiveness   dispersion
 * BA-1   high spin+launch + low-spin ball         launchSpin    distance
 * BA-2   softerFeel goal + soft ball              feel          (was single)
 * SH-1   high speed + aggressive + heavy shaft    dispersion    distance
 * SH-2   launchAngle < 10 + high-launch shaft     launchSpin    (was single)
 * IR-1   handicap > 15 + forgiving irons          forgiveness   dispersion
 * IR-2   low trajectory + high-launch irons       launchSpin    (was single)
 *
 * Goal bonuses (applied after equipment rules):
 *   G-1  moreDistance      → distance    +8
 *   G-2  lessSpin          → launchSpin  +8
 *   G-3  higherLaunch      → launchSpin  +8
 *   G-4  tighterDispersion → dispersion  +7
 *   G-5  softerFeel        → feel +8 on balls (captured by BA-2)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { EquipmentOption } from "../data/seed";
import type { FitSessionInput, RecommendationCategory } from "./types";
import {
  BASE_SCORE,
  BONUS,
  GOAL_BONUSES,
  PENALTY,
  THRESHOLD,
} from "./scoringConstants";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DimensionKey = "distance" | "dispersion" | "launchSpin" | "feel" | "forgiveness";

export interface RuleEvaluation {
  distance: number;
  dispersion: number;
  launchSpin: number;
  feel: number;
  forgiveness: number;
  reasons: string[];
}

/** Structured rule definition. */
export interface Rule {
  id: string;
  dimension: DimensionKey;
  categories: RecommendationCategory[];
  /** Returns true when the equipment is a good match → apply bonus. */
  match: (input: FitSessionInput, option: EquipmentOption) => boolean;
  bonus: number;
  matchReason: string;
  /** Returns true when the equipment is an active mismatch → apply penalty. */
  mismatch?: (input: FitSessionInput, option: EquipmentOption) => boolean;
  penalty?: number;
  mismatchReason?: string;
}

export interface GoalRule {
  id: string;
  dimension: DimensionKey;
  active: (input: FitSessionInput) => boolean;
  bonus: number;
  reason: string;
}

// ── Rule definitions ──────────────────────────────────────────────────────────

export const RULES: Rule[] = [
  // ── Driver rules ────────────────────────────────────────────────────────────

  {
    id: "DR-1",
    dimension: "launchSpin",
    categories: ["driver"],
    match: (i, o) =>
      (i.launchData.spinRate ?? 0) > THRESHOLD.SPIN_HIGH && o.spinProfile === "low",
    bonus: BONUS.DR_1_LAUNCH_SPIN,
    matchReason: "Spin above 3 000 rpm aligned with low-spin driver head.",
    mismatch: (i, o) =>
      (i.launchData.spinRate ?? Infinity) < THRESHOLD.SPIN_LOW && o.spinProfile === "low",
    penalty: PENALTY.DR_1P_LAUNCH_SPIN,
    mismatchReason: "Spin already below 2 500 rpm — low-spin driver offers no benefit.",
  },

  {
    id: "DR-2",
    dimension: "launchSpin",
    categories: ["driver"],
    match: (i, o) =>
      (i.launchData.launchAngle ?? Infinity) < THRESHOLD.LAUNCH_LOW &&
      o.launchProfile !== "low",
    bonus: BONUS.DR_2_LAUNCH_SPIN,
    matchReason: "Launch below 10° benefits from added loft/launch support.",
    mismatch: (i, o) =>
      (i.launchData.launchAngle ?? 0) > THRESHOLD.LAUNCH_HIGH && o.launchProfile === "high",
    penalty: PENALTY.DR_2P_LAUNCH_SPIN,
    mismatchReason: "Launch already above 15° — a high-launch driver would overshoot the optimal window.",
  },

  {
    id: "DR-3",
    dimension: "dispersion",
    categories: ["driver"],
    match: (i, o) => i.profile.missTendency === "right" && o.bias === "draw",
    bonus: BONUS.DR_3_DISPERSION,
    matchReason: "Right miss tendency matched with draw-biased head.",
    mismatch: (i, o) => i.profile.missTendency === "left" && o.bias === "draw",
    penalty: PENALTY.DR_3P_DISPERSION,
    mismatchReason: "Left miss tendency — draw-bias driver would worsen the miss.",
  },

  {
    id: "DR-4",
    dimension: "forgiveness",
    categories: ["driver"],
    match: (i, o) =>
      (i.launchData.consistencyIndex ?? Infinity) < THRESHOLD.CONSISTENCY_LOW &&
      o.forgivenessLevel === "high",
    bonus: BONUS.DR_4_FORGIVENESS,
    matchReason: "Inconsistent strike pattern matched with high-MOI forgiveness.",
    mismatch: (i, o) =>
      (i.launchData.consistencyIndex ?? 0) > THRESHOLD.CONSISTENCY_HIGH &&
      o.forgivenessLevel === "high",
    penalty: PENALTY.DR_4P_FORGIVENESS,
    mismatchReason: "Consistent striker — high-MOI head provides no forgiveness benefit.",
  },

  // ── Ball rules ───────────────────────────────────────────────────────────────

  {
    id: "BA-1",
    dimension: "launchSpin",
    categories: ["ball"],
    match: (i, o) =>
      (i.launchData.spinRate ?? 0) > THRESHOLD.SPIN_VERY_HIGH &&
      (i.launchData.launchAngle ?? 0) > THRESHOLD.LAUNCH_HIGH &&
      o.spinProfile === "low",
    bonus: BONUS.BA_1_LAUNCH_SPIN,
    matchReason: "High spin and high launch favour a lower-spin ball flight.",
    mismatch: (i, o) =>
      (i.launchData.spinRate ?? Infinity) < THRESHOLD.SPIN_LOW && o.spinProfile === "low",
    penalty: PENALTY.BA_1P_LAUNCH_SPIN,
    mismatchReason: "Spin already below 2 500 rpm — low-spin ball offers no benefit.",
  },

  {
    id: "BA-2",
    dimension: "feel",
    categories: ["ball"],
    match: (i, o) => i.goals.softerFeel && o.feel === "soft",
    bonus: GOAL_BONUSES.softerFeel,
    matchReason: "Softer feel goal matched with soft urethane profile.",
  },

  // ── Shaft rules ──────────────────────────────────────────────────────────────

  {
    id: "SH-1",
    dimension: "dispersion",
    categories: ["shaft"],
    match: (i, o) =>
      (i.launchData.clubSpeed ?? 0) > THRESHOLD.CLUB_SPEED_HIGH &&
      i.profile.tempo === "aggressive" &&
      o.weightClass === "heavy",
    bonus: BONUS.SH_1_DISPERSION,
    matchReason: "High speed and aggressive tempo favour a heavier, stable shaft.",
    mismatch: (i, o) =>
      ((i.launchData.clubSpeed ?? Infinity) < THRESHOLD.CLUB_SPEED_LOW ||
        i.profile.tempo === "smooth") &&
      o.weightClass === "heavy",
    penalty: PENALTY.SH_1P_DISPERSION,
    mismatchReason: "Smooth tempo or low club speed — heavy shaft will reduce control.",
  },

  {
    id: "SH-2",
    dimension: "launchSpin",
    categories: ["shaft"],
    match: (i, o) =>
      (i.launchData.launchAngle ?? Infinity) < THRESHOLD.LAUNCH_LOW &&
      o.launchProfile === "high",
    bonus: BONUS.SH_2_LAUNCH_SPIN,
    matchReason: "Low launch improved by higher-launch shaft profile.",
    mismatch: (i, o) =>
      (i.launchData.launchAngle ?? 0) > THRESHOLD.LAUNCH_HIGH && o.launchProfile === "high",
    penalty: PENALTY.SH_2P_LAUNCH_SPIN,
    mismatchReason: "Launch already above 15° — high-launch shaft would overshoot.",
  },

  // ── Iron rules ───────────────────────────────────────────────────────────────

  {
    id: "IR-1",
    dimension: "forgiveness",
    categories: ["irons"],
    match: (i, o) =>
      i.profile.handicap > THRESHOLD.HANDICAP_HIGH && o.forgivenessLevel === "high",
    bonus: BONUS.IR_1_FORGIVENESS,
    matchReason: "Handicap profile supports a more forgiving iron design.",
    mismatch: (i, o) =>
      i.profile.handicap < THRESHOLD.HANDICAP_LOW && o.forgivenessLevel === "high",
    penalty: PENALTY.IR_1P_FORGIVENESS,
    mismatchReason: "Single-digit handicap — game-improvement irons sacrifice workability.",
  },

  {
    id: "IR-2",
    dimension: "launchSpin",
    categories: ["irons"],
    match: (i, o) => i.profile.trajectory === "low" && o.launchProfile === "high",
    bonus: BONUS.IR_2_LAUNCH_SPIN,
    matchReason: "Low trajectory tendency benefits from higher-launch iron setup.",
    mismatch: (i, o) => i.profile.trajectory === "high" && o.launchProfile === "high",
    penalty: PENALTY.IR_2P_LAUNCH_SPIN,
    mismatchReason: "Already a high-ball hitter — high-launch irons may balloon flight.",
  },
];

// ── Goal-bonus rules ──────────────────────────────────────────────────────────
//
// Applied after equipment rules. They amplify whichever options already scored
// well in the relevant dimension rather than targeting specific equipment traits.
// softerFeel is handled by BA-2 above (ball-only, equipment-aware).

export const GOAL_RULES: GoalRule[] = [
  {
    id: "G-1",
    dimension: "distance",
    active: (i) => i.goals.moreDistance,
    bonus: GOAL_BONUSES.moreDistance,
    reason: "More distance goal amplifies distance-oriented options.",
  },
  {
    id: "G-2",
    dimension: "launchSpin",
    active: (i) => i.goals.lessSpin,
    bonus: GOAL_BONUSES.lessSpin,
    reason: "Lower spin goal amplifies low-spin options.",
  },
  {
    id: "G-3",
    dimension: "launchSpin",
    active: (i) => i.goals.higherLaunch,
    bonus: GOAL_BONUSES.higherLaunch,
    reason: "Higher launch goal amplifies high-launch options.",
  },
  {
    id: "G-4",
    dimension: "dispersion",
    active: (i) => i.goals.tighterDispersion,
    bonus: GOAL_BONUSES.tighterDispersion,
    reason: "Tighter dispersion goal amplifies accuracy-oriented options.",
  },
];

// ── Evaluator ─────────────────────────────────────────────────────────────────

export function evaluateOption(
  input: FitSessionInput,
  option: EquipmentOption,
): RuleEvaluation {
  const scores: Record<DimensionKey, number> = {
    distance: BASE_SCORE,
    dispersion: BASE_SCORE,
    launchSpin: BASE_SCORE,
    feel: BASE_SCORE,
    forgiveness: BASE_SCORE,
  };
  const reasons: string[] = [];

  for (const rule of RULES) {
    if (!rule.categories.includes(option.category)) continue;

    if (rule.match(input, option)) {
      scores[rule.dimension] += rule.bonus;
      reasons.push(rule.matchReason);
    } else if (rule.mismatch?.(input, option) && rule.penalty !== undefined) {
      scores[rule.dimension] += rule.penalty; // penalty is negative
      if (rule.mismatchReason) reasons.push(rule.mismatchReason);
    }
  }

  for (const gr of GOAL_RULES) {
    if (gr.active(input)) {
      scores[gr.dimension] += gr.bonus;
      reasons.push(gr.reason);
    }
  }

  if (reasons.length === 0) {
    reasons.push("Balanced fit against current player profile and goals.");
  }

  return {
    distance: scores.distance,
    dispersion: scores.dispersion,
    launchSpin: scores.launchSpin,
    feel: scores.feel,
    forgiveness: scores.forgiveness,
    reasons,
  };
}
