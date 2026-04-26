/**
 * SCORING CONSTANTS
 *
 * All tunable numbers for the fitting engine live here. Rule functions and
 * the engine import from this module — no magic numbers buried elsewhere.
 */

// ── Goal bonus targets ────────────────────────────────────────────────────────
//
// Each goal checkbox should move the final score by approximately this many
// points, regardless of which dimension it lives in.  The dimension-level bonus
// is back-calculated as:
//
//   dimensionBonus = GOAL_TARGET_FINAL_IMPACT / categoryWeight[dimension]
//
// Pre-computed below for the default CATEGORY_WEIGHTS.  softerFeel only fires
// for balls (ball.feel = 0.25) → 2.0 / 0.25 = 8.  tighterDispersion uses the
// highest dispersion weight among categories (driver = 0.30) as its reference
// → 2.0 / 0.30 ≈ 7.
export const GOAL_TARGET_FINAL_IMPACT = 2.0;

export const GOAL_BONUSES = {
  moreDistance: 8,       // distance dim  — 8 × 0.25 = 2.00 pts
  lessSpin: 8,           // launchSpin dim — 8 × 0.25 = 2.00 pts
  higherLaunch: 8,       // launchSpin dim — 8 × 0.25 = 2.00 pts
  tighterDispersion: 7,  // dispersion dim — 7 × 0.30 = 2.10 pts
  softerFeel: 8,         // feel dim       — 8 × 0.25 = 2.00 pts (ball category)
} as const;

// ── Rule bonuses ──────────────────────────────────────────────────────────────
export const BONUS = {
  DR_1_LAUNCH_SPIN: 25,   // high spin + low-spin driver
  DR_2_LAUNCH_SPIN: 20,   // low launch angle + not-low-launch driver
  DR_3_DISPERSION: 25,    // right miss + draw-bias driver
  DR_4_FORGIVENESS: 25,   // low consistency index + high-MOI driver
  BA_1_LAUNCH_SPIN: 25,   // high spin + high launch + low-spin ball
  SH_1_DISPERSION: 20,    // high speed + aggressive tempo + heavy shaft
  SH_2_LAUNCH_SPIN: 20,   // low launch angle + high-launch shaft
  IR_1_FORGIVENESS: 25,   // high handicap + high-forgiveness irons
  IR_2_LAUNCH_SPIN: 18,   // low trajectory + high-launch irons
} as const;

// ── Rule penalties (roughly symmetric to bonuses) ─────────────────────────────
export const PENALTY = {
  DR_1P_LAUNCH_SPIN: -15,  // already low spin + low-spin driver
  DR_2P_LAUNCH_SPIN: -15,  // already high launch + high-launch driver
  DR_3P_DISPERSION: -20,   // left miss + draw-bias driver
  DR_4P_FORGIVENESS: -15,  // consistent striker + high-MOI driver
  BA_1P_LAUNCH_SPIN: -15,  // already low spin + low-spin ball
  SH_1P_DISPERSION: -20,   // smooth/slow tempo + heavy shaft
  SH_2P_LAUNCH_SPIN: -10,  // already high launch + high-launch shaft
  IR_1P_FORGIVENESS: -20,  // low handicap (scratch-level) + high-forgiveness irons
  IR_2P_LAUNCH_SPIN: -12,  // high trajectory + high-launch irons
} as const;

// ── Thresholds ────────────────────────────────────────────────────────────────
export const THRESHOLD = {
  SPIN_HIGH: 3000,       // rpm — triggers low-spin driver bonus
  SPIN_VERY_HIGH: 3200,  // rpm — triggers low-spin ball bonus
  SPIN_LOW: 2500,        // rpm — below this, low-spin equipment adds no value
  LAUNCH_LOW: 10,        // degrees — triggers launch-improvement bonuses
  LAUNCH_HIGH: 15,       // degrees — above this, more launch is counterproductive
  CONSISTENCY_LOW: 45,   // 0–100 index — triggers forgiveness bonus
  CONSISTENCY_HIGH: 70,  // 0–100 index — consistent striker, forgiveness not needed
  CLUB_SPEED_HIGH: 103,  // mph — triggers heavy-shaft stability bonus
  CLUB_SPEED_LOW: 85,    // mph — below this, heavy shaft is detrimental
  HANDICAP_HIGH: 15,     // triggers forgiving-iron bonus
  HANDICAP_LOW: 5,       // scratch/near-scratch — forgiving irons are a downgrade
} as const;

// ── Base dimension score ──────────────────────────────────────────────────────
// All dimensions start here before bonuses and penalties are applied.
export const BASE_SCORE = 50;

// ── Category-specific dimension weight maps ───────────────────────────────────
//
// Each category only weights dimensions that have actual rules affecting it.
// Weights sum to 1.0 per category.  A weight of 0.00 means no rules exist for
// that dimension in that category; the dimension score carries no signal and
// should not influence the final rank.
//
// These are the values used in the design spec (Issue 6).  Adjust here — the
// engine reads them dynamically.
export const CATEGORY_WEIGHTS = {
  driver: { distance: 0.25, dispersion: 0.30, launchSpin: 0.25, feel: 0.05, forgiveness: 0.15 },
  iron:   { distance: 0.20, dispersion: 0.35, launchSpin: 0.10, feel: 0.10, forgiveness: 0.25 },
  shaft:  { distance: 0.20, dispersion: 0.35, launchSpin: 0.35, feel: 0.00, forgiveness: 0.10 },
  ball:   { distance: 0.20, dispersion: 0.15, launchSpin: 0.30, feel: 0.25, forgiveness: 0.10 },
} as const;

export type CategoryKey = keyof typeof CATEGORY_WEIGHTS;

// ── Match-strength thresholds ─────────────────────────────────────────────────
// Used to compute matchStrength from the normalized final score.
export const MATCH_STRENGTH_THRESHOLDS = {
  STRONG: 0.70,    // normalized score ≥ 0.70 → "strong"
  MODERATE: 0.45,  // normalized score ≥ 0.45 → "moderate"
  // < 0.45 → "weak"
} as const;
