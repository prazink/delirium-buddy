import type { LogEntry, PersonProfile } from '../logs/log.types';

export type SevenDaySummary = {
  totalLogs: number;
  highestConcernDay?: LogEntry | undefined;
  redFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  summaryText: string;
};

export function buildSevenDaySummary(logs: LogEntry[], profile: PersonProfile | null): SevenDaySummary {
  const recentLogs = logs.slice(-7);
  const highestConcernDay = [...recentLogs].sort((a, b) => concernScore(b) - concernScore(a))[0];
  const redFlags = Array.from(new Set(recentLogs.flatMap(getRedFlags)));
  const medicationChangeDays = recentLogs.filter((log) => log.medsChanged).length;
  const feverOrInfectionDays = recentLogs.filter((log) => log.feverOrInfection).length;
  const personLabel = profile?.displayName ?? 'the person being tracked';

  return {
    totalLogs: recentLogs.length,
    highestConcernDay,
    redFlags,
    medicationChangeDays,
    feverOrInfectionDays,
    summaryText: buildSummaryText({
      personLabel,
      recentLogs,
      redFlags,
      medicationChangeDays,
      feverOrInfectionDays,
      highestConcernDay,
    }),
  };
}

function buildSummaryText({
  personLabel,
  recentLogs,
  redFlags,
  medicationChangeDays,
  feverOrInfectionDays,
  highestConcernDay,
}: {
  personLabel: string;
  recentLogs: LogEntry[];
  redFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  highestConcernDay?: LogEntry | undefined;
}): string {
  if (recentLogs.length === 0) {
    return 'No check-ins have been recorded yet. This is a personal tracking summary only, not a medical diagnosis.';
  }

  const lines = [
    `7-day personal tracking summary for ${personLabel}`,
    `Total check-ins: ${recentLogs.length}`,
    highestConcernDay
      ? `Highest concern day: ${highestConcernDay.date} (agitation ${highestConcernDay.agitation}/10, confusion ${highestConcernDay.confusion}/10, sleep ${highestConcernDay.sleepHours}h)`
      : undefined,
    `Medication change days: ${medicationChangeDays}`,
    `Fever or infection days: ${feverOrInfectionDays}`,
    `Red flags noted: ${redFlags.length ? redFlags.join(', ') : 'None recorded'}`,
    'This is a personal tracking summary only. It does not diagnose delirium and does not replace medical assessment.',
  ].filter(Boolean);

  return lines.join('\n');
}

function concernScore(log: LogEntry): number {
  let score = log.agitation + log.confusion + Math.max(0, 8 - log.sleepHours);

  if (log.medsChanged) score += 2;
  if (log.feverOrInfection) score += 3;
  if (log.suddenChange) score += 4;
  if (log.hallucination) score += 3;
  if (log.fallOrNearFall) score += 4;

  return score;
}

function getRedFlags(log: LogEntry): string[] {
  const flags: string[] = [];

  if (log.suddenChange) flags.push('Sudden change');
  if (log.feverOrInfection) flags.push('Fever or infection');
  if (log.fallOrNearFall) flags.push('Fall or near fall');
  if (log.hallucination) flags.push('Hallucination');
  if (log.sleepHours <= 3) flags.push('Very low sleep');
  if (log.agitation >= 8) flags.push('Severe agitation');
  if (log.confusion >= 8) flags.push('Severe confusion');
  if (log.urineInfectionConcern) flags.push('Urine infection concern');

  return flags;
}
