import type { LogEntry } from './log.types';

export type ObservationLabel = {
  id: string;
  label: string;
  tone: 'neutral' | 'watch' | 'red-flag';
};

export function getLogObservationLabels(log: LogEntry): ObservationLabel[] {
  const labels: ObservationLabel[] = [];

  if (log.suddenChange) labels.push({ id: 'sudden-change', label: 'Sudden change', tone: 'red-flag' });
  if (log.feverOrInfection) labels.push({ id: 'fever', label: 'Fever/infection', tone: 'watch' });
  if (log.hallucination) labels.push({ id: 'hallucination', label: 'Hallucination', tone: 'watch' });
  if (log.fallOrNearFall) labels.push({ id: 'fall', label: 'Fall/near fall', tone: 'red-flag' });
  if (log.medsChanged) labels.push({ id: 'meds', label: 'Medication changed', tone: 'watch' });
  if (log.hydrationConcern) labels.push({ id: 'hydration', label: 'Hydration concern', tone: 'neutral' });
  if (log.eatingConcern) labels.push({ id: 'eating', label: 'Eating concern', tone: 'neutral' });
  if (log.painConcern) labels.push({ id: 'pain', label: 'Pain concern', tone: 'neutral' });
  if (log.mobilityConcern) labels.push({ id: 'mobility', label: 'Mobility concern', tone: 'neutral' });
  if (log.urineInfectionConcern) labels.push({ id: 'urine', label: 'Urine infection concern', tone: 'watch' });
  if (log.glassesOrHearingAidsMissing) {
    labels.push({ id: 'sensory-aids', label: 'Glasses/hearing aids missing', tone: 'neutral' });
  }

  return labels;
}
