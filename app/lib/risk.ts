
import type { LogEntry } from "../types";

export type RiskState = {
  level: "No data" | "Low" | "Moderate" | "High";
  tip: string;
  color: string;
  score: number;
  reasons: string[];
};

export function calculateRisk(logs: LogEntry[]): RiskState {
  if (!logs.length)
    return {
      level: "No data",
      tip: "Add a log to get insights.",
      color: "#64748b",
      score: 0,
      reasons: [],
    };

  const last = logs[logs.length - 1];
  let score = 0;
  // Weights
  score += norm(last.agitation, 0, 10) * 35;
  score += norm(last.confusion, 0, 10) * 35;
  score += (1 - norm(Math.min(last.sleepHours, 10), 0, 10)) * 20;
  if (last.medsChanged) score += 5;
  if (last.feverOrInfection) score += 10;

  const reasons: string[] = [];
  if (last.agitation >= 7) reasons.push("High agitation today");
  if (last.confusion >= 7) reasons.push("High confusion today");
  if (last.sleepHours <= 3) reasons.push("Very low sleep");
  if (last.medsChanged) reasons.push("Medication recently changed");
  if (last.feverOrInfection) reasons.push("Fever or infection present");

  // Trend boost over last ~3 entries
  const recent = logs.slice(-4);
  if (recent.length >= 3) {
    const xs = recent.map((_, i) => i);
    const ys = recent.map((l) => (l.agitation + l.confusion) / 2);
    const slope = linearSlope(xs, ys);
    if (slope > 0.6) {
      score += 10;
      reasons.push("Upward trend past 3 days");
    }
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 70)
    return {
      level: "High",
      tip: "Consider contacting care staff. Reduce noise, ensure hydration, orient with clocks/calendars.",
      color: "#dc2626",
      score,
      reasons,
    };
  if (score >= 40)
    return {
      level: "Moderate",
      tip: "Monitor closely. Keep routine consistent and encourage daylight exposure.",
      color: "#ca8a04",
      score,
      reasons,
    };
  return {
    level: "Low",
    tip: "Maintain normal routine and good sleep hygiene.",
    color: "#059669",
    score,
    reasons,
  };
}

function norm(v: number, min: number, max: number) {
  return (Math.max(min, Math.min(max, v)) - min) / (max - min);
}
function linearSlope(xs: number[], ys: number[]) {
  const n = xs.length;
  const sumx = xs.reduce((a, b) => a + b, 0);
  const sumy = ys.reduce((a, b) => a + b, 0);
  const sumxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumx2 = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumx2 - sumx * sumx || 1;
  return (n * sumxy - sumx * sumy) / denom;
}
