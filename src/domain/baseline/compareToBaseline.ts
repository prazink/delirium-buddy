import type { LogEntry, PersonProfile } from '../logs/log.types';

export type BaselineInsight = {
  id: string;
  label: string;
  detail: string;
  severity: 'info' | 'watch' | 'red-flag';
};

export function compareToBaseline(
  latestLog: LogEntry | undefined,
  profile: PersonProfile | null,
): BaselineInsight[] {
  if (!latestLog || !profile) {
    return [];
  }

  const insights: BaselineInsight[] = [];

  if (profile.normalSleepMin !== undefined && latestLog.sleepHours < profile.normalSleepMin) {
    insights.push({
      id: 'sleep-below-baseline',
      label: 'Sleep below usual range',
      detail: `Logged ${latestLog.sleepHours}h, below the usual minimum of ${profile.normalSleepMin}h.`,
      severity: latestLog.sleepHours <= 3 ? 'red-flag' : 'watch',
    });
  }

  if (profile.normalSleepMax !== undefined && latestLog.sleepHours > profile.normalSleepMax + 2) {
    insights.push({
      id: 'sleep-above-baseline',
      label: 'Sleep above usual range',
      detail: `Logged ${latestLog.sleepHours}h, above the usual range for ${profile.displayName}.`,
      severity: 'info',
    });
  }

  if (
    profile.normalConfusionBaseline !== undefined &&
    latestLog.confusion >= profile.normalConfusionBaseline + 3
  ) {
    insights.push({
      id: 'confusion-above-baseline',
      label: 'Confusion higher than baseline',
      detail: `Confusion was ${latestLog.confusion}/10 compared with a usual baseline of ${profile.normalConfusionBaseline}/10.`,
      severity: latestLog.confusion >= 8 ? 'red-flag' : 'watch',
    });
  }

  if (latestLog.suddenChange) {
    insights.push({
      id: 'sudden-change',
      label: 'Sudden change noted',
      detail: 'A sudden change from usual behaviour was recorded. Consider sharing this with care staff.',
      severity: 'red-flag',
    });
  }

  if (latestLog.feverOrInfection) {
    insights.push({
      id: 'fever-infection',
      label: 'Fever or infection noted',
      detail: 'Fever or infection was recorded. This can be important context for a care conversation.',
      severity: 'watch',
    });
  }

  if (latestLog.fallOrNearFall) {
    insights.push({
      id: 'fall-near-fall',
      label: 'Fall or near fall noted',
      detail: 'A fall or near fall was recorded. Consider discussing this with care staff.',
      severity: 'red-flag',
    });
  }

  if (latestLog.hallucination) {
    insights.push({
      id: 'hallucination',
      label: 'Hallucination noted',
      detail: 'Hallucination was recorded. This may be useful to include in a care summary.',
      severity: 'watch',
    });
  }

  return insights;
}
