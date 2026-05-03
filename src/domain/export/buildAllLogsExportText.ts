import { getLogObservationLabels } from '../logs/getLogObservationLabels';
import type { LogEntry, PersonProfile } from '../logs/log.types';

export function buildAllLogsExportText(logs: LogEntry[], profile: PersonProfile | null): string {
  const personLabel = profile?.displayName ?? 'the person being tracked';
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  if (sortedLogs.length === 0) {
    return [
      `Delirium Buddy local log export for ${personLabel}`,
      '',
      'No check-ins have been recorded yet.',
      '',
      'This is a personal tracking export only. It does not diagnose delirium and does not replace medical assessment.',
    ].join('\n');
  }

  const entries = sortedLogs.map((log) => {
    const labels = getLogObservationLabels(log);
    const observations = labels.length > 0 ? labels.map((label) => label.label).join(', ') : 'None recorded';

    return [
      `Date: ${log.date}`,
      `- Agitation: ${log.agitation}/10`,
      `- Confusion: ${log.confusion}/10`,
      `- Sleep: ${log.sleepHours}h`,
      `- Observations: ${observations}`,
      `- Notes: ${log.notes?.trim() ? log.notes.trim() : 'No notes added.'}`,
    ].join('\n');
  });

  return [
    `Delirium Buddy local log export for ${personLabel}`,
    `Total check-ins: ${sortedLogs.length}`,
    '',
    entries.join('\n\n---\n\n'),
    '',
    'This is a personal tracking export only. It does not diagnose delirium and does not replace medical assessment.',
  ].join('\n');
}
