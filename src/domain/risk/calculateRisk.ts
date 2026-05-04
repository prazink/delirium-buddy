import type { LogEntry } from '../logs/log.types';
import { scoreFourAt } from '../screening/fourAt';
import { clamp } from '../../utils/numbers';

export type RiskLevel = 'No data' | 'Low' | 'Moderate' | 'High';

export type RiskState = {
  level: RiskLevel;
  tip: string;
  color: string;
  score: number;
  reasons: string[];
};

const NO_DATA_STATE: RiskState = {
  level: 'No data',
  tip: 'Add a log to get insights.',
  color: '#64748b',
  score: 0,
  reasons: [],
};

// This is an explainable support score for personal tracking only.
// It is not a diagnosis, clinical prediction model, treatment plan, or medical advice.
export function calculateRisk(logs: LogEntry[]): RiskState {
  if (logs.length === 0) {
    return NO_DATA_STATE;
  }

  const last = logs[logs.length - 1];

  if (!last) {
    return NO_DATA_STATE;
  }

  let score = 0;

  score += normalise(last.agitation, 0, 10) * 35;
  score += normalise(last.confusion, 0, 10) * 35;
  score += (1 - normalise(Math.min(last.sleepHours, 10), 0, 10)) * 20;

  if (last.medsChanged) {
    score += 5;
  }

  if (last.feverOrInfection) {
    score += 10;
  }

  const reasons = buildReasons(last);

  if (last.fourAt) {
    const screenResult = scoreFourAt(last.fourAt);

    if (screenResult.totalScore > 0) {
      reasons.push(`Structured screen score recorded: ${screenResult.totalScore}`);
    }

    if (screenResult.isPositiveScreen) {
      score += 20;
      reasons.push('Structured screen flag recorded');
    }
  }

  const recentLogs = logs.slice(-4);

  if (hasUpwardTrend(recentLogs)) {
    score += 10;
    reasons.push('Upward trend past 3 days');
  }

  const safeScore = clamp(score, 0, 100);

  if (safeScore >= 70) {
    return {
      level: 'High',
      tip: 'Consider contacting care staff. Reduce noise, ensure hydration, orient with clocks/calendars.',
      color: '#dc2626',
      score: safeScore,
      reasons,
    };
  }

  if (safeScore >= 40) {
    return {
      level: 'Moderate',
      tip: 'Monitor closely. Keep routine consistent and encourage daylight exposure.',
      color: '#ca8a04',
      score: safeScore,
      reasons,
    };
  }

  return {
    level: 'Low',
    tip: 'Maintain normal routine and good sleep hygiene.',
    color: '#059669',
    score: safeScore,
    reasons,
  };
}

function buildReasons(entry: LogEntry): string[] {
  const reasons: string[] = [];

  if (entry.agitation >= 7) {
    reasons.push('High agitation today');
  }

  if (entry.confusion >= 7) {
    reasons.push('High confusion today');
  }

  if (entry.sleepHours <= 3) {
    reasons.push('Very low sleep');
  }

  if (entry.medsChanged) {
    reasons.push('Medication recently changed');
  }

  if (entry.feverOrInfection) {
    reasons.push('Fever or infection present');
  }

  return reasons;
}

function hasUpwardTrend(logs: LogEntry[]): boolean {
  if (logs.length < 3) {
    return false;
  }

  const xValues = logs.map((_, index) => index);
  const yValues = logs.map((log) => (log.agitation + log.confusion) / 2);

  return linearSlope(xValues, yValues) > 0.6;
}

function normalise(value: number, min: number, max: number): number {
  return (clamp(value, min, max) - min) / (max - min);
}

function linearSlope(xValues: number[], yValues: number[]): number {
  const itemCount = xValues.length;
  const sumX = xValues.reduce((total, value) => total + value, 0);
  const sumY = yValues.reduce((total, value) => total + value, 0);
  const sumXY = xValues.reduce((total, value, index) => total + value * (yValues[index] ?? 0), 0);
  const sumX2 = xValues.reduce((total, value) => total + value * value, 0);
  const denominator = itemCount * sumX2 - sumX * sumX || 1;

  return (itemCount * sumXY - sumX * sumY) / denominator;
}
