import type { FitRecommendationResult } from "./fitting/types";

const STORAGE_KEY = "gsgl_sessions";
const MAX_SESSIONS = 20;

export interface StoredSession {
  id: string;
  date: string;
  focus: string;
  confidence: "High" | "Medium" | "Low";
  result: FitRecommendationResult;
}

export function saveSession(
  result: FitRecommendationResult,
  goalLabels: string[],
): StoredSession {
  const session: StoredSession = {
    id: `GS-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    focus: goalLabels.length > 0 ? goalLabels.join(", ") : "Full bag evaluation",
    confidence: result.confidence,
    result,
  };

  const existing = loadSessions();
  const updated = [session, ...existing].slice(0, MAX_SESSIONS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage quota exceeded or unavailable — silently skip
  }

  return session;
}

export function loadSessions(): StoredSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession[]) : [];
  } catch {
    return [];
  }
}

export function clearSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function confidencePoints(c: "High" | "Medium" | "Low"): number {
  if (c === "High") return 90;
  if (c === "Medium") return 70;
  return 50;
}

export function sessionStats(sessions: StoredSession[]) {
  const total = sessions.length;
  if (total === 0) return { total: 0, avgConfidence: 0, lastDate: null };

  const avgConfidence = Math.round(
    sessions.reduce((sum, s) => sum + confidencePoints(s.confidence), 0) / total,
  );

  return { total, avgConfidence, lastDate: sessions[0].date };
}
