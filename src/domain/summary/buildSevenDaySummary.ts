import type { LogEntry, PersonProfile } from '../logs/log.types';
import { getLogObservationLabels } from '../logs/getLogObservationLabels';
import { scoreFourAt } from '../screening/fourAt';

export type HandoverPriority = 'routine' | 'watch' | 'urgent_review';

export type SevenDaySummary = {
  totalLogs: number;
  dateRange: string;
  personLabel: string;
  carerContext?: string | undefined;
  highestConcernDay?: LogEntry | undefined;
  redFlags: string[];
  careContextFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  suddenChangeDays: number;
  structuredScreeningCount: number;
  positiveStructuredScreens: number;
  averageAgitation: number;
  averageConfusion: number;
  averageSleepHours: number;
  handoverPriority: HandoverPriority;
  handoverHeadline: string;
  keyTalkingPoints: string[];
  suggestedQuestions: string[];
  summaryText: string;
};

export function buildSevenDaySummary(logs: LogEntry[], profile: PersonProfile | null): SevenDaySummary {
  const recentLogs = logs.slice(-7);
  const highestConcernDay = [...recentLogs].sort((a, b) => concernScore(b) - concernScore(a))[0];
  const redFlags = Array.from(new Set(recentLogs.flatMap(getRedFlags)));
  const careContextFlags = Array.from(new Set(recentLogs.flatMap(getCareContextFlags)));
  const medicationChangeDays = recentLogs.filter((log) => log.medsChanged).length;
  const feverOrInfectionDays = recentLogs.filter((log) => log.feverOrInfection).length;
  const suddenChangeDays = recentLogs.filter((log) => log.suddenChange).length;
  const structuredResults = recentLogs.flatMap((log) => log.fourAt ? [scoreFourAt(log.fourAt)] : []);
  const structuredScreeningCount = structuredResults.length;
  const positiveStructuredScreens = structuredResults.filter((result) => result.isPositiveScreen).length;
  const personLabel = profile?.displayName ?? 'the person being tracked';
  const carerContext = buildCarerContext(profile);
  const averageAgitation = average(recentLogs.map((log) => log.agitation));
  const averageConfusion = average(recentLogs.map((log) => log.confusion));
  const averageSleepHours = average(recentLogs.map((log) => log.sleepHours));
  const handoverPriority = getHandoverPriority({ redFlags, positiveStructuredScreens, feverOrInfectionDays, suddenChangeDays, highestConcernDay });
  const handoverHeadline = buildHandoverHeadline(handoverPriority, recentLogs.length);
  const keyTalkingPoints = buildTalkingPoints({
    recentLogs,
    highestConcernDay,
    redFlags,
    careContextFlags,
    medicationChangeDays,
    feverOrInfectionDays,
    suddenChangeDays,
    structuredScreeningCount,
    positiveStructuredScreens,
    averageAgitation,
    averageConfusion,
    averageSleepHours,
  });
  const suggestedQuestions = buildSuggestedQuestions({
    redFlags,
    careContextFlags,
    medicationChangeDays,
    feverOrInfectionDays,
    suddenChangeDays,
    positiveStructuredScreens,
  });
  const dateRange = buildDateRange(recentLogs);

  return {
    totalLogs: recentLogs.length,
    dateRange,
    personLabel,
    carerContext,
    highestConcernDay,
    redFlags,
    careContextFlags,
    medicationChangeDays,
    feverOrInfectionDays,
    suddenChangeDays,
    structuredScreeningCount,
    positiveStructuredScreens,
    averageAgitation,
    averageConfusion,
    averageSleepHours,
    handoverPriority,
    handoverHeadline,
    keyTalkingPoints,
    suggestedQuestions,
    summaryText: buildSummaryText({
      personLabel,
      carerContext,
      dateRange,
      recentLogs,
      redFlags,
      careContextFlags,
      medicationChangeDays,
      feverOrInfectionDays,
      suddenChangeDays,
      structuredScreeningCount,
      positiveStructuredScreens,
      averageAgitation,
      averageConfusion,
      averageSleepHours,
      highestConcernDay,
      handoverHeadline,
      keyTalkingPoints,
      suggestedQuestions,
    }),
  };
}

function buildSummaryText({
  personLabel,
  carerContext,
  dateRange,
  recentLogs,
  redFlags,
  careContextFlags,
  medicationChangeDays,
  feverOrInfectionDays,
  suddenChangeDays,
  structuredScreeningCount,
  positiveStructuredScreens,
  averageAgitation,
  averageConfusion,
  averageSleepHours,
  highestConcernDay,
  handoverHeadline,
  keyTalkingPoints,
  suggestedQuestions,
}: {
  personLabel: string;
  carerContext?: string | undefined;
  dateRange: string;
  recentLogs: LogEntry[];
  redFlags: string[];
  careContextFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  suddenChangeDays: number;
  structuredScreeningCount: number;
  positiveStructuredScreens: number;
  averageAgitation: number;
  averageConfusion: number;
  averageSleepHours: number;
  highestConcernDay?: LogEntry | undefined;
  handoverHeadline: string;
  keyTalkingPoints: string[];
  suggestedQuestions: string[];
}): string {
  if (recentLogs.length === 0) {
    return 'No check-ins have been recorded yet. This is a personal tracking summary only, not a medical diagnosis.';
  }

  const lines = [
    `Delirium Buddy handover summary for ${personLabel}`,
    carerContext ? `Care context: ${carerContext}` : undefined,
    `Period: ${dateRange}`,
    `Headline: ${handoverHeadline}`,
    '',
    'Overview:',
    `- Total check-ins: ${recentLogs.length}`,
    `- Average agitation: ${formatNumber(averageAgitation)}/10`,
    `- Average confusion: ${formatNumber(averageConfusion)}/10`,
    `- Average sleep: ${formatNumber(averageSleepHours)}h`,
    highestConcernDay
      ? `- Highest concern day: ${highestConcernDay.date} (agitation ${highestConcernDay.agitation}/10, confusion ${highestConcernDay.confusion}/10, sleep ${highestConcernDay.sleepHours}h)`
      : undefined,
    `- Medication change days: ${medicationChangeDays}`,
    `- Fever or infection days: ${feverOrInfectionDays}`,
    `- Sudden change days: ${suddenChangeDays}`,
    `- Structured screening recorded: ${structuredScreeningCount} time${structuredScreeningCount === 1 ? '' : 's'}`,
    `- Positive structured screens: ${positiveStructuredScreens}`,
    '',
    'Key talking points:',
    ...keyTalkingPoints.map((point) => `- ${point}`),
    '',
    'Red flags noted:',
    `- ${redFlags.length ? redFlags.join(', ') : 'None recorded'}`,
    '',
    'Care context noted:',
    `- ${careContextFlags.length ? careContextFlags.join(', ') : 'None recorded'}`,
    '',
    'Questions to ask care staff:',
    ...suggestedQuestions.map((question) => `- ${question}`),
    '',
    'This is a personal tracking and handover summary only. It does not diagnose delirium and does not replace medical assessment.',
  ].filter((line): line is string => line !== undefined);

  return lines.join('\n');
}

function concernScore(log: LogEntry): number {
  let score = log.agitation + log.confusion + Math.max(0, 8 - log.sleepHours);

  if (log.medsChanged) score += 2;
  if (log.feverOrInfection) score += 3;
  if (log.suddenChange) score += 4;
  if (log.hallucination) score += 3;
  if (log.fallOrNearFall) score += 4;
  if (log.fourAt && scoreFourAt(log.fourAt).isPositiveScreen) score += 5;

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
  if (log.fourAt && scoreFourAt(log.fourAt).isPositiveScreen) flags.push('Positive structured screen');

  return flags;
}

function getCareContextFlags(log: LogEntry): string[] {
  return getLogObservationLabels(log)
    .filter((label) => label.tone !== 'red-flag')
    .map((label) => label.label);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildDateRange(logs: LogEntry[]): string {
  if (logs.length === 0) return 'No check-ins recorded';

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0]?.date;
  const last = sorted[sorted.length - 1]?.date;

  if (!first || !last) return 'No check-ins recorded';
  return first === last ? first : `${first} to ${last}`;
}

function buildCarerContext(profile: PersonProfile | null): string | undefined {
  if (!profile) return undefined;

  const parts = [
    profile.careRole ? `Role: ${profile.careRole}` : undefined,
    profile.relationship ? `Relationship: ${profile.relationship}` : undefined,
  ].filter(Boolean);

  return parts.length ? parts.join(' | ') : undefined;
}

function getHandoverPriority({
  redFlags,
  positiveStructuredScreens,
  feverOrInfectionDays,
  suddenChangeDays,
  highestConcernDay,
}: {
  redFlags: string[];
  positiveStructuredScreens: number;
  feverOrInfectionDays: number;
  suddenChangeDays: number;
  highestConcernDay?: LogEntry | undefined;
}): HandoverPriority {
  if (
    positiveStructuredScreens > 0 ||
    suddenChangeDays > 0 ||
    redFlags.includes('Fall or near fall') ||
    (highestConcernDay && concernScore(highestConcernDay) >= 20)
  ) {
    return 'urgent_review';
  }

  if (redFlags.length > 0 || feverOrInfectionDays > 0) {
    return 'watch';
  }

  return 'routine';
}

function buildHandoverHeadline(priority: HandoverPriority, totalLogs: number): string {
  if (totalLogs === 0) return 'No check-ins recorded yet.';

  if (priority === 'urgent_review') {
    return 'Important changes were recorded. Consider discussing this with care staff promptly.';
  }

  if (priority === 'watch') {
    return 'Some changes were recorded. Monitor closely and discuss if symptoms continue.';
  }

  return 'No major red flags were recorded in the latest check-ins.';
}

function buildTalkingPoints({
  recentLogs,
  highestConcernDay,
  redFlags,
  careContextFlags,
  medicationChangeDays,
  feverOrInfectionDays,
  suddenChangeDays,
  structuredScreeningCount,
  positiveStructuredScreens,
  averageAgitation,
  averageConfusion,
  averageSleepHours,
}: {
  recentLogs: LogEntry[];
  highestConcernDay?: LogEntry | undefined;
  redFlags: string[];
  careContextFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  suddenChangeDays: number;
  structuredScreeningCount: number;
  positiveStructuredScreens: number;
  averageAgitation: number;
  averageConfusion: number;
  averageSleepHours: number;
}): string[] {
  if (recentLogs.length === 0) return ['No check-ins recorded yet.'];

  const points: string[] = [];

  if (highestConcernDay) {
    points.push(`Highest concern was recorded on ${highestConcernDay.date}.`);
  }

  if (averageConfusion >= 6) {
    points.push(`Confusion averaged ${formatNumber(averageConfusion)}/10 across the latest check-ins.`);
  }

  if (averageAgitation >= 6) {
    points.push(`Agitation averaged ${formatNumber(averageAgitation)}/10 across the latest check-ins.`);
  }

  if (averageSleepHours > 0 && averageSleepHours < 5) {
    points.push(`Average sleep was ${formatNumber(averageSleepHours)}h, below the usual target for many people.`);
  }

  if (suddenChangeDays > 0) {
    points.push(`Sudden change was recorded on ${suddenChangeDays} day${suddenChangeDays === 1 ? '' : 's'}.`);
  }

  if (feverOrInfectionDays > 0) {
    points.push(`Fever or infection concern was recorded on ${feverOrInfectionDays} day${feverOrInfectionDays === 1 ? '' : 's'}.`);
  }

  if (medicationChangeDays > 0) {
    points.push(`Medication changes were recorded on ${medicationChangeDays} day${medicationChangeDays === 1 ? '' : 's'}.`);
  }

  if (positiveStructuredScreens > 0) {
    points.push(`Structured screening flagged possible concern ${positiveStructuredScreens} time${positiveStructuredScreens === 1 ? '' : 's'}.`);
  } else if (structuredScreeningCount > 0) {
    points.push(`Structured screening was recorded ${structuredScreeningCount} time${structuredScreeningCount === 1 ? '' : 's'} without a positive screen.`);
  }

  if (redFlags.length > 0) {
    points.push(`Red flags noted: ${redFlags.join(', ')}.`);
  }

  if (careContextFlags.length > 0) {
    points.push(`Care context noted: ${careContextFlags.join(', ')}.`);
  }

  return points.slice(0, 6);
}

function buildSuggestedQuestions({
  redFlags,
  careContextFlags,
  medicationChangeDays,
  feverOrInfectionDays,
  suddenChangeDays,
  positiveStructuredScreens,
}: {
  redFlags: string[];
  careContextFlags: string[];
  medicationChangeDays: number;
  feverOrInfectionDays: number;
  suddenChangeDays: number;
  positiveStructuredScreens: number;
}): string[] {
  const questions: string[] = [];

  if (suddenChangeDays > 0 || positiveStructuredScreens > 0) {
    questions.push('Does this change need clinical review today?');
  }

  if (feverOrInfectionDays > 0 || redFlags.includes('Urine infection concern')) {
    questions.push('Could infection, pain, dehydration or medication changes be contributing?');
  }

  if (medicationChangeDays > 0) {
    questions.push('Could any recent medicine changes be affecting alertness, sleep or confusion?');
  }

  if (careContextFlags.includes('Hydration concern') || careContextFlags.includes('Eating concern')) {
    questions.push('What hydration, nutrition or comfort support should we prioritise today?');
  }

  if (redFlags.includes('Fall or near fall')) {
    questions.push('What falls-risk precautions should be reviewed?');
  }

  if (questions.length === 0) {
    questions.push('What should we keep monitoring over the next few days?');
  }

  questions.push('When should we repeat the next check-in or structured screen?');

  return questions.slice(0, 5);
}
