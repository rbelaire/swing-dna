export type Tempo = "smooth" | "medium" | "aggressive";
export type MissTendency = "left" | "right" | "both";
export type Trajectory = "low" | "mid" | "high";

export interface PlayerProfile {
  handicap: number;
  heightIn: number;
  wristToFloorIn: number;
  ageRange: "under30" | "30to50" | "over50";
  tempo: Tempo;
  missTendency: MissTendency;
  trajectory: Trajectory;
}

export interface CurrentEquipment {
  driverModel: string;
  driverLoft: string;
  driverShaft: string;
  ironModel: string;
  ironShaft: string;
  ballModel: string;
}

export interface LaunchData {
  clubSpeed?: number;
  ballSpeed?: number;
  launchAngle?: number;
  spinRate?: number;
  carryDistance?: number;
  attackAngle?: number;
  consistencyIndex?: number;
}

export interface FitGoals {
  moreDistance: boolean;
  lessSpin: boolean;
  higherLaunch: boolean;
  tighterDispersion: boolean;
  softerFeel: boolean;
}

export interface FitSessionInput {
  profile: PlayerProfile;
  equipment: CurrentEquipment;
  launchData: LaunchData;
  goals: FitGoals;
}

export type RecommendationCategory = "ball" | "driver" | "irons" | "shaft";

/**
 * How complete the player's input is.
 * Replaces the old single-label confidence for the data-availability axis.
 */
export type DataConfidence = "none" | "profile_only" | "profile_and_launch";

/**
 * How well the top pick scored relative to the candidate set and a theoretical
 * ideal. Replaces the old single-label confidence for the match-quality axis.
 */
export type MatchStrength = "strong" | "moderate" | "weak";

export interface ScoredRecommendation {
  id: string;
  name: string;
  category: RecommendationCategory;
  /** Normalized 0–100 final score (min-max across the category). */
  score: number;
  reasons: string[];
  expectedImprovement: string;
  /**
   * @deprecated Use dataConfidence + matchStrength on FitRecommendationResult.
   * Kept for session-history backward compatibility; derived from matchStrength.
   */
  confidence: "High" | "Medium" | "Low";
  components: {
    distance: number;
    dispersion: number;
    launchSpin: number;
    feel: number;
    forgiveness: number;
  };
  /** Whether the build coherence pass swapped this item in from #2. */
  swappedForCoherence?: boolean;
}

export interface FitRecommendationResult {
  ball: ScoredRecommendation[];
  driver: ScoredRecommendation[];
  irons: ScoredRecommendation[];
  shafts: ScoredRecommendation[];
  /**
   * @deprecated Kept for session-history backward compatibility.
   * Use dataConfidence + matchStrength below.
   */
  confidence: "High" | "Medium" | "Low";
  /** How complete the player's input was. */
  dataConfidence: DataConfidence;
  /** How well the top picks scored relative to the candidate field. */
  matchStrength: MatchStrength;
  buildSpecs: {
    lengthAdjustment: string;
    lieAdjustment: string;
    gripSize: string;
  };
  /** Human-readable summary combining both confidence signals. */
  confidenceSummary: string;
}
