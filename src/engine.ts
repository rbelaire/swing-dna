import { balls, drivers, irons, shafts } from "../data/seed";
import type { EquipmentOption } from "../data/seed";
import { evaluateOption } from "./rules";
import {
  buildConfidenceSummary,
  computeDataConfidence,
  computeMatchStrength,
  matchStrengthToLegacyConfidence,
  minMaxNormalize,
  weightedScore,
} from "./scoring";
import { validateBuildCoherence } from "./coherence";
import type {
  FitRecommendationResult,
  FitSessionInput,
  ScoredRecommendation,
} from "./types";

export interface EquipmentCatalog {
  balls: EquipmentOption[];
  drivers: EquipmentOption[];
  irons: EquipmentOption[];
  shafts: EquipmentOption[];
}

const SEED_CATALOG: EquipmentCatalog = { balls, drivers, irons, shafts };

// ── Build specs ───────────────────────────────────────────────────────────────

function buildSpecs(input: FitSessionInput) {
  const { heightIn, wristToFloorIn } = input.profile;
  let lengthAdjustment = "Standard";
  let lieAdjustment = "Standard";

  if (heightIn > 74 && wristToFloorIn > 36) {
    lengthAdjustment = "+0.5 in";
    lieAdjustment = "+1° upright";
  } else if (heightIn < 66 && wristToFloorIn < 32) {
    lengthAdjustment = "-0.5 in";
    lieAdjustment = "-1° flat";
  }

  const gripSize = heightIn > 73 ? "Midsize" : "Standard";

  return { lengthAdjustment, lieAdjustment, gripSize };
}

// ── Expected improvement sentence ────────────────────────────────────────────

function expectedGain(category: string, normalizedScore: number): string {
  if (normalizedScore >= 70)
    return `Strong projected gains in ${category} optimization.`;
  if (normalizedScore >= 40)
    return `Moderate projected gains in ${category} with testing validation.`;
  return `Incremental gains expected in ${category}; prioritize validation session.`;
}

// ── Score a single category ───────────────────────────────────────────────────
//
// 1. Compute raw weighted scores (no per-dimension cap).
// 2. Min-max normalize across the candidate set → 0–100.
// 3. Return top 3 sorted by normalized score.

function scoreCategory(
  input: FitSessionInput,
  options: EquipmentOption[],
): ScoredRecommendation[] {
  if (options.length === 0) return [];

  const evaluations = options.map((option) => ({
    option,
    evaluation: evaluateOption(input, option),
  }));

  const rawScores = evaluations.map(({ option, evaluation }) =>
    weightedScore(evaluation, option.category),
  );

  const normalizedScores = minMaxNormalize(rawScores);

  const recommendations: ScoredRecommendation[] = evaluations.map(
    ({ option, evaluation }, i) => {
      const score = normalizedScores[i];
      const matchStr = computeMatchStrength(score);
      return {
        id: option.id,
        category: option.category,
        name: option.name,
        score,
        reasons: evaluation.reasons,
        expectedImprovement: expectedGain(option.category, score),
        confidence: matchStrengthToLegacyConfidence(matchStr),
        components: {
          distance: evaluation.distance,
          dispersion: evaluation.dispersion,
          launchSpin: evaluation.launchSpin,
          feel: evaluation.feel,
          forgiveness: evaluation.forgiveness,
        },
      } satisfies ScoredRecommendation;
    },
  );

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
}

// ── Main engine ───────────────────────────────────────────────────────────────

/**
 * Run the fitting engine against a player input.
 *
 * Pass a `catalog` to use equipment fetched from Firestore (or any other
 * source). Omit it to fall back to the local seed data — useful in tests
 * and when Firebase is not configured.
 */
export function runFittingEngine(
  input: FitSessionInput,
  catalog: EquipmentCatalog = SEED_CATALOG,
): FitRecommendationResult {
  const ballRecs = scoreCategory(input, catalog.balls);
  const driverRecs = scoreCategory(input, catalog.drivers);
  const ironRecs = scoreCategory(input, catalog.irons);
  const shaftRecs = scoreCategory(input, catalog.shafts);

  // Build coherence pass — may swap #2 picks to resolve known bad combos.
  const coherentBuild = validateBuildCoherence({
    driver: driverRecs,
    shaft: shaftRecs,
    ball: ballRecs,
    iron: ironRecs,
  });

  // Merge coherence swaps back into the ranked lists (keep ranking order
  // intact, just replace the #1 slot if it was swapped).
  function mergeCoherence(
    recs: ScoredRecommendation[],
    coherentPick: ScoredRecommendation,
  ): ScoredRecommendation[] {
    if (recs.length === 0) return recs;
    if (recs[0].id === coherentPick.id) return recs; // no swap
    const rest = recs.filter((r) => r.id !== coherentPick.id).slice(0, 2);
    return [coherentPick, ...rest];
  }

  const finalDriver = mergeCoherence(driverRecs, coherentBuild.driver);
  const finalShaft = mergeCoherence(shaftRecs, coherentBuild.shaft);
  const finalBall = mergeCoherence(ballRecs, coherentBuild.ball);
  const finalIron = mergeCoherence(ironRecs, coherentBuild.iron);

  // Confidence signals
  const dataConfidence = computeDataConfidence(
    input.launchData as Record<string, unknown>,
  );

  const topScores = [
    finalBall[0]?.score ?? 0,
    finalDriver[0]?.score ?? 0,
    finalIron[0]?.score ?? 0,
    finalShaft[0]?.score ?? 0,
  ];
  const overallTopScore = Math.round(
    topScores.reduce((a, b) => a + b, 0) / topScores.length,
  );

  const matchStrength = computeMatchStrength(overallTopScore);
  const legacyConfidence = matchStrengthToLegacyConfidence(matchStrength);
  const confidenceSummary = buildConfidenceSummary(dataConfidence, matchStrength);

  return {
    ball: finalBall,
    driver: finalDriver,
    irons: finalIron,
    shafts: finalShaft,
    confidence: legacyConfidence,
    dataConfidence,
    matchStrength,
    confidenceSummary,
    buildSpecs: buildSpecs(input),
  };
}
