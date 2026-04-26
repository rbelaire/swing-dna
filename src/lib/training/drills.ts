import type { Drill, HandicapBand, SkillLevel, TrainingProfile, Week, Session } from "./types";

// ── Core drill library ────────────────────────────────────────────────────────

export const DRILL_LIBRARY: Drill[] = [
  { id: "drv-fairway-gates", name: "Fairway Gates Ladder", description: "Set alignment sticks as gates at increasing distances. Work through each gate hitting fairway-width targets, tracking hit percentage.", weaknesses: ["Driving accuracy"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "drv-start-line-spray", name: "Start-Line Spray Audit", description: "Hit 20 drives tracking start line vs intended line. Map your dispersion pattern to identify bias (push, pull, or centered).", weaknesses: ["Driving accuracy"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "drv-tee-pressure", name: "One-Ball Tee Pressure", description: "Simulate first-tee pressure: one ball, one target, full pre-shot routine. Score pass/fail on each rep with a consequence for misses.", weaknesses: ["Driving accuracy"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "drv-window-control", name: "Launch Window Control", description: "Practice hitting drives within a specific launch angle window. Alternate between low-punch and high-draw to build flight control.", weaknesses: ["Driving accuracy"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "drv-fairway-9shot", name: "9-Hole Fairway Keeper", description: "Play 9 imaginary holes off the tee, each with a different shape and target. Score fairways hit out of 9.", weaknesses: ["Driving accuracy"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "app-wedge-ladder", name: "Wedge Distance Ladder", description: "Hit each wedge at 50%, 75%, and 100% distances. Track carry vs target for each club to build your personal distance chart.", weaknesses: ["Approach consistency"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "app-face-strike-grid", name: "Face Strike Grid", description: "Use foot spray or impact tape to track strike location on the face. Hit 10 shots aiming for center contact, then review the pattern.", weaknesses: ["Approach consistency"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "app-shot-shape-alternating", name: "Alternating Shape Reps", description: "Hit alternating draw-fade pairs to the same target. Builds shot versatility and clubface awareness under demand.", weaknesses: ["Approach consistency"], type: "technical", levels: ["advanced", "intermediate"] },
  { id: "app-proximity-challenge", name: "Proximity Circle Challenge", description: "Pick a pin and hit 10 approach shots. Score points for landing inside 30ft, bonus inside 15ft. Track your proximity average.", weaknesses: ["Approach consistency"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "app-approach-9hole", name: "Approach Simulation 9", description: "Simulate 9 approach shots from varying distances and lies. Change clubs and targets each time to mimic on-course conditions.", weaknesses: ["Approach consistency"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "sg-landing-zones", name: "Landing Zone Towel Matrix", description: "Place towels at 3 landing zones around the green. Chip/pitch to each zone in rotation, scoring 1 point per successful landing.", weaknesses: ["Short game touch"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "sg-updown-circuit", name: "Up-and-Down Circuit", description: "Drop balls at 6 spots around the green with different lies. Get up-and-down from each. Track your save percentage.", weaknesses: ["Short game touch"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "sg-bunker-variability", name: "Bunker Variability Reps", description: "Hit bunker shots from plugged, uphill, downhill, and flat lies. Focus on consistent exit and distance control.", weaknesses: ["Short game touch"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "sg-random-lie-scramble", name: "Random Lie Scramble", description: "Toss a ball randomly around the green 10 times. Play each lie as it sits — rough, fringe, bare — and try to save par.", weaknesses: ["Short game touch"], type: "transfer", levels: ["intermediate", "advanced"] },
  { id: "sg-wedge-clock", name: "Wedge Clock System", description: "Use 9 o'clock, 10:30, and full swings with each wedge. Record carry distances to build a reliable partial-swing chart.", weaknesses: ["Short game touch"], type: "technical", levels: ["beginner", "intermediate"] },
  { id: "putt-gate-startline", name: "Start Line Gate", description: "Set two tees as a gate 2 feet in front of the ball. Roll 20 putts through the gate to train start-line accuracy.", weaknesses: ["Putting confidence"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-ladder-369", name: "3-6-9 Pressure Ladder", description: "Make a putt from 3ft, then 6ft, then 9ft. If you miss, restart. Builds clutch putting under escalating pressure.", weaknesses: ["Putting confidence"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-read-compare", name: "Read-and-React Compare", description: "Read the break before each putt, commit to the line, then compare result to your read. Trains green-reading accuracy.", weaknesses: ["Putting confidence"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "putt-make-10-row", name: "Make 10 in a Row", description: "From 3 feet, make 10 consecutive putts. If you miss, restart the count. Builds short-putt confidence and routine.", weaknesses: ["Putting confidence"], type: "pressure", levels: ["beginner", "intermediate"] },
  { id: "putt-par18", name: "Par-18 Putting Game", description: "Play 9 holes on the putting green, par 2 each. Track your score vs 18. Simulates real scoring pressure on the greens.", weaknesses: ["Putting confidence"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "cm-club-selection-tree", name: "Club Selection Decision Tree", description: "For each approach, list 3 club options with risk/reward. Choose the highest-percentage play and log your reasoning.", weaknesses: ["Course management"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "cm-risk-reward-log", name: "Risk/Reward Decision Log", description: "On every par-5 and driveable par-4, write your decision (go/layup) and outcome. Review patterns after the round.", weaknesses: ["Course management"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "cm-miss-map", name: "Miss Map Strategy", description: "Before each shot, identify the safe miss side. Aim so your miss still leaves a playable next shot. Log misses vs plan.", weaknesses: ["Course management"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "cm-3ball-choices", name: "3-Ball Choice Test", description: "Hit 3 balls from the same spot with 3 different strategies (aggressive, safe, creative). Compare outcomes to train shot selection.", weaknesses: ["Course management"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "cm-post-round-audit", name: "Post-Round Audit Loop", description: "After a round, review 3 best and 3 worst decisions. Note what you would change and carry one adjustment into next round.", weaknesses: ["Course management"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-mobility-sequence", name: "Mobility and Tempo Sequence", description: "5-minute dynamic stretch plus 10 half-speed swings. Primes the body, sets tempo, and builds a repeatable warm-up ritual.", weaknesses: ["Driving accuracy", "Approach consistency", "Short game touch", "Putting confidence", "Course management"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-contact-baseline", name: "Contact Baseline Check", description: "Hit 10 easy 7-irons focusing purely on center contact. Rate each strike 1-5 to establish your baseline for the session.", weaknesses: ["Driving accuracy", "Approach consistency"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-pre-shot-routine", name: "Pre-Shot Routine Rehearsal", description: "Run your full pre-shot routine on every rep: read, visualize, commit, execute. Time each routine to build consistency.", weaknesses: ["Driving accuracy", "Approach consistency", "Short game touch", "Putting confidence", "Course management"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-score-target", name: "Score Target Challenge", description: "Set a target score for a practice game. Play the game with full routine and track vs target.", weaknesses: ["Driving accuracy", "Approach consistency", "Short game touch", "Putting confidence", "Course management"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-recovery-shots", name: "Recovery Shot Scenarios", description: "Practice punch-outs, low hooks under trees, and flop shots over obstacles. Builds the creative shot-making you need on course.", weaknesses: ["Course management", "Approach consistency"], type: "transfer", levels: ["intermediate", "advanced"] },
  { id: "drv-tempo-trainer", name: "Tempo Ratio Trainer", description: "Hit drives at 60%, 75%, and 90% effort, recording distance and accuracy for each. Find the effort level that maximizes fairways hit.", weaknesses: ["Driving accuracy"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "drv-alignment-reset", name: "Alignment Station Reset", description: "Set up a full alignment station with sticks. Hit 5 drives, remove sticks, hit 5 more. Compare dispersion to train body memory.", weaknesses: ["Driving accuracy"], type: "technical", levels: ["beginner", "intermediate"] },
  { id: "drv-windy-9", name: "Windy 9 Simulation", description: "Simulate 9 holes with crosswind, headwind, and downwind conditions. Adjust ball flight shape for each and score fairways hit.", weaknesses: ["Driving accuracy"], type: "transfer", levels: ["intermediate", "advanced"] },
  { id: "drv-3club-challenge", name: "3-Club Tee Challenge", description: "Play 9 tee shots using only driver, 3-wood, and a long iron. Pick the best club for each hole shape to build strategic tee-shot thinking.", weaknesses: ["Driving accuracy"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "drv-rhythm-breath", name: "Rhythm and Breath Sync", description: "Inhale during backswing, exhale through impact. Hit 15 drives focusing only on breath timing.", weaknesses: ["Driving accuracy"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
  { id: "app-stock-yardage", name: "Stock Yardage Builder", description: "Pick one iron and hit 20 shots with your stock swing. Record carry distances to find your true average and dispersion for that club.", weaknesses: ["Approach consistency"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "app-uphill-downhill", name: "Uphill/Downhill Lie Reps", description: "Find or simulate uphill and downhill lies. Hit 10 shots from each, adjusting aim and club selection.", weaknesses: ["Approach consistency"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "app-pin-hunter", name: "Pin Hunter 10-Shot Test", description: "Pick 10 different pins at varying distances. One shot per pin with full routine. Score based on proximity.", weaknesses: ["Approach consistency"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "app-3quarter-mastery", name: "Three-Quarter Swing Mastery", description: "Hit every iron in your bag at three-quarter effort. Record each carry to build a knockdown distance chart.", weaknesses: ["Approach consistency"], type: "technical", levels: ["beginner", "intermediate"] },
  { id: "app-round-replay", name: "Approach Round Replay", description: "Recreate 9 approach shots from your last round. Same clubs, same distances. See if you can beat your actual proximity results.", weaknesses: ["Approach consistency"], type: "transfer", levels: ["intermediate", "advanced"] },
  { id: "sg-flop-commit", name: "Flop Shot Commitment Drill", description: "Open the face fully and commit to 10 high-lofted flop shots over a towel. Focus on acceleration through impact.", weaknesses: ["Short game touch"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "sg-chip-putt-match", name: "Chip vs Putt Match Play", description: "From the fringe, alternate chipping and putting to the same hole. Score match play style to learn when each technique wins.", weaknesses: ["Short game touch"], type: "transfer", levels: ["beginner", "intermediate"] },
  { id: "sg-distance-ladder", name: "Short Game Distance Ladder", description: "Chip to targets at 10, 20, 30, and 40 feet. Complete 3 successful reps at each distance before moving to the next.", weaknesses: ["Short game touch"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "sg-worst-ball-scramble", name: "Worst Ball Scramble", description: "Drop 2 balls around the green. Always play the worse lie. Get up-and-down from 6 locations.", weaknesses: ["Short game touch"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "sg-trajectory-trio", name: "Trajectory Trio Drill", description: "From the same spot, hit a low runner, a medium pitch, and a high lob. Repeat from 5 spots to build trajectory control.", weaknesses: ["Short game touch"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-speed-only", name: "Eyes-Closed Speed Drill", description: "Putt with your eyes closed from 20, 30, and 40 feet. Focus purely on feel and distance control.", weaknesses: ["Putting confidence"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-clock-game", name: "Clock Putting Game", description: "Place 12 balls in a clock pattern around the hole at 4 feet. Make all 12 to complete the clock.", weaknesses: ["Putting confidence"], type: "pressure", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-lag-zone", name: "Lag Putt Safe Zone", description: "From 30-50 feet, putt to a 3-foot circle around the hole. Score how many of 10 putts finish inside the zone.", weaknesses: ["Putting confidence"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "putt-break-mapping", name: "Break Mapping Station", description: "Pick a sloped putt and roll balls from different speeds. Map how break changes with pace.", weaknesses: ["Putting confidence"], type: "technical", levels: ["intermediate", "advanced"] },
  { id: "putt-round-sim", name: "18-Hole Putting Simulation", description: "Play 18 putts of varying length and break on the practice green. Par is 36. Track your score over multiple sessions.", weaknesses: ["Putting confidence"], type: "transfer", levels: ["intermediate", "advanced"] },
  { id: "cm-bogey-avoidance", name: "Bogey Avoidance Drill", description: "Play 9 practice holes with one rule: no doubles. Choose the safest play on every shot.", weaknesses: ["Course management"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "cm-par3-strategy", name: "Par-3 Strategy Session", description: "For 6 par-3 distances, choose club and target aiming for the fat part of the green. Score based on green hits.", weaknesses: ["Course management"], type: "technical", levels: ["beginner", "intermediate"] },
  { id: "cm-mental-scorecard", name: "Mental Scorecard Drill", description: "Play 9 imaginary holes, announcing club, target, and strategy aloud before each shot.", weaknesses: ["Course management"], type: "technical", levels: ["beginner", "intermediate", "advanced"] },
  { id: "cm-penalty-avoidance", name: "Penalty Avoidance Game", description: "Set OB and hazard lines on the range. Play 9 tee shots where any ball past the line is a penalty stroke.", weaknesses: ["Course management"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "cm-shot-budget", name: "Shot Budget Challenge", description: "Give yourself a shot budget per hole. Plan each shot to stay within budget, prioritizing position over distance.", weaknesses: ["Course management"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-grip-pressure-check", name: "Grip Pressure Awareness", description: "Hit 10 shots rating grip pressure 1-10 on each. Find the pressure level that produces best contact.", weaknesses: ["Driving accuracy", "Approach consistency", "Short game touch"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-balance-finish", name: "Balance Finish Hold", description: "Hit full shots and hold your finish for 3 seconds on every rep. If you can't hold it, the swing was out of balance.", weaknesses: ["Driving accuracy", "Approach consistency"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-visualization-reps", name: "Visualization Rehearsal", description: "Before each shot, close your eyes and visualize the ball flight for 5 seconds. Then execute.", weaknesses: ["Driving accuracy", "Approach consistency", "Short game touch", "Putting confidence", "Course management"], type: "transfer", levels: ["beginner", "intermediate", "advanced"] },
  { id: "base-random-club-roulette", name: "Random Club Roulette", description: "Pull a random club from your bag for each shot. Adapt your target and shot shape to the club.", weaknesses: ["Approach consistency", "Course management"], type: "pressure", levels: ["intermediate", "advanced"] },
  { id: "base-cooldown-focus", name: "Cooldown Focus Sequence", description: "End practice with 5 easy wedge shots, 5 chips, and 5 short putts. All at 50% effort.", weaknesses: ["Short game touch", "Putting confidence", "Approach consistency"], type: "warmup", levels: ["beginner", "intermediate", "advanced"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function handicapBand(handicap: string): HandicapBand {
  if (handicap.toLowerCase().includes("beginner") || handicap.includes("20+")) return "Beginner (20+)";
  if (handicap.toLowerCase().includes("intermediate") || handicap.includes("10-19")) return "Intermediate (10-19)";
  return "Advanced (0-9)";
}

function bandToLevel(band: HandicapBand): SkillLevel {
  if (band === "Beginner (20+)") return "beginner";
  if (band === "Intermediate (10-19)") return "intermediate";
  return "advanced";
}

function weekTheme(weakness: string, weekIdx: number): string {
  const themes: Record<string, string[]> = {
    "Driving accuracy": ["Start-Line Foundation", "Pressure Reps", "Shape Mastery", "On-Course Transfer"],
    "Approach consistency": ["Distance Control Foundation", "Strike Quality", "Scoring Zone Focus", "Simulation Round"],
    "Short game touch": ["Landing Zone Basics", "Touch and Feel", "Up-and-Down Circuit", "Course Scramble Sim"],
    "Putting confidence": ["Start-Line Basics", "Speed Control", "Pressure Putting", "Round Simulation"],
    "Course management": ["Decision Framework", "Risk/Reward Mapping", "Pressure Decisions", "On-Course Application"],
  };
  const t = themes[weakness] ?? ["Foundation", "Development", "Pressure", "Transfer"];
  return `Week ${weekIdx + 1}: ${t[weekIdx % 4]}`;
}

function sessionBullets(drillIds: string[], weakness: string, type: "opening" | "middle" | "closing"): string[] {
  const bullets: string[] = [];
  if (type === "opening") bullets.push(`Open with your warmup drill to prime movement and focus.`);
  bullets.push(`Main block: target ${weakness.toLowerCase()} with deliberate reps.`);
  if (type === "closing") bullets.push(`Close with a pressure or transfer drill to lock in the skill.`);
  return bullets;
}

/** Simple deterministic-ish seeded number for drill variety */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pickDrill(
  candidates: Drill[],
  usedIds: Set<string>,
  seedOffset: number,
): Drill | null {
  const available = candidates.filter((d) => !usedIds.has(d.id));
  if (available.length === 0) return null;
  const idx = Math.floor(pseudoRandom(seedOffset) * available.length);
  return available[idx];
}

// ── Rules engine ──────────────────────────────────────────────────────────────

export function buildRulesRoutine(profile: TrainingProfile): { weeks: Week[] } {
  const band = handicapBand(profile.handicap);
  const level = bandToLevel(band);
  const primaryWeakness = profile.weaknesses[0] ?? profile.weakness;
  const secondaryWeakness = profile.weaknesses[1];

  const warmupDrills = DRILL_LIBRARY.filter(
    (d) => d.type === "warmup" && d.levels.includes(level),
  );
  const technicalDrills = DRILL_LIBRARY.filter(
    (d) =>
      (d.type === "technical") &&
      d.levels.includes(level) &&
      (d.weaknesses.includes(primaryWeakness) ||
        (secondaryWeakness && d.weaknesses.includes(secondaryWeakness))),
  );
  const pressureDrills = DRILL_LIBRARY.filter(
    (d) =>
      (d.type === "pressure" || d.type === "transfer") &&
      d.levels.includes(level) &&
      (d.weaknesses.includes(primaryWeakness) ||
        (secondaryWeakness && d.weaknesses.includes(secondaryWeakness))),
  );

  const usedIds = new Set<string>();
  const weeks: Week[] = [];

  for (let w = 0; w < 4; w++) {
    const weekWeakness = w % 2 === 0 ? primaryWeakness : (secondaryWeakness ?? primaryWeakness);
    const sessions: Session[] = [];

    for (let s = 0; s < profile.daysPerWeek; s++) {
      const seed = w * 100 + s * 10;

      const warmup = pickDrill(warmupDrills, usedIds, seed);
      const technical = pickDrill(technicalDrills, usedIds, seed + 1);
      const pressure = pickDrill(pressureDrills, usedIds, seed + 2);

      const drillIds: string[] = [];
      if (warmup) { drillIds.push(warmup.id); usedIds.add(warmup.id); }
      if (technical) { drillIds.push(technical.id); usedIds.add(technical.id); }
      if (pressure) { drillIds.push(pressure.id); usedIds.add(pressure.id); }

      const sessionType = s === 0 ? "opening" : s === profile.daysPerWeek - 1 ? "closing" : "middle";

      sessions.push({
        title: `Session ${s + 1}`,
        bullets: sessionBullets(drillIds, weekWeakness, sessionType),
        drillIds,
      });
    }

    weeks.push({
      week: w + 1,
      headline: weekTheme(weekWeakness, w),
      sessions,
    });
  }

  return { weeks };
}

export function validateProfileShape(profile: Partial<TrainingProfile>): boolean {
  if (!profile || typeof profile !== "object") return false;
  const name = (profile.name ?? "").trim();
  const handicap = (profile.handicap ?? "").trim();
  const weaknesses = profile.weaknesses ?? [];
  const hasWeakness = weaknesses.length > 0 || (profile.weakness ?? "").trim();
  const daysPerWeek = Number(profile.daysPerWeek ?? 0);
  const hoursPerSession = Number(profile.hoursPerSession ?? 0);
  return Boolean(name && handicap && hasWeakness && daysPerWeek > 0 && hoursPerSession > 0);
}

export function normalizeProfile(raw: Partial<TrainingProfile>): TrainingProfile {
  const rawWeaknesses = Array.isArray(raw.weaknesses) ? raw.weaknesses : [];
  const weaknesses = rawWeaknesses.map((w) => String(w).slice(0, 50)).filter(Boolean).slice(0, 2);
  const weakness = weaknesses[0] ?? String(raw.weakness ?? "").slice(0, 50);
  if (weakness && !weaknesses.includes(weakness)) weaknesses.unshift(weakness);
  return {
    name: String(raw.name ?? "").slice(0, 100),
    handicap: String(raw.handicap ?? "").slice(0, 50),
    weakness,
    weaknesses,
    daysPerWeek: Math.max(1, Math.min(7, Math.round(Number(raw.daysPerWeek ?? 3)))),
    hoursPerSession: Math.max(0.5, Math.min(4, Math.round(Number(raw.hoursPerSession ?? 1.5) * 4) / 4)),
    notes: String(raw.notes ?? "").slice(0, 2000),
  };
}

export function getDrillById(id: string): Drill | undefined {
  return DRILL_LIBRARY.find((d) => d.id === id);
}

export const WEAKNESS_OPTIONS = [
  "Driving accuracy",
  "Approach consistency",
  "Short game touch",
  "Putting confidence",
  "Course management",
];

export const HANDICAP_OPTIONS: HandicapBand[] = [
  "Beginner (20+)",
  "Intermediate (10-19)",
  "Advanced (0-9)",
];
