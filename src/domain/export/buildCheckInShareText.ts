import { getLogObservationLabels } from '../logs/getLogObservationLabels';
import type { LogEntry, PersonProfile } from '../logs/log.types';

export function buildCheckInShareText(log: LogEntry, profile: PersonProfile | null): string {
  const personLabel = profile?.displayName ?? 'the person being tracked';
  const labels = getLogObservationLabels(log);
  const observations = labels.length > 0 ? labels.map((label) => `- ${label.label}`).join('\n') : '- None recorded';

  return [
    `Delirium Buddy check-in for ${personLabel}`,
    '',
    `Date: ${log.date}`,
    `Agitation: ${log.agitation}/10`,
    `Confusion: ${log.confusion}/10`,
    `Sleep: ${log.sleepHours}h`,
    '',
    'Observations noted:',
    observations,
    '',
    'Notes:',
    log.notes?.trim() ? log.notes.trim() : 'No notes added.',
    '',
    'This is a personal tracking summary only. It does not diagnose delirium and does not replace medical assessment.',
  ].join('\n');
}
