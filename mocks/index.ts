/**
 * Mock data for running the app without a backend or seeded SecureStore.
 * Reflects the HTML mockup scenario: Mary Smith, 82, with a good week trend.
 * Dates roll forward to "today" (last 7 days from 2026-05-04) so the demo
 * always shows "Today, 9:20 am" on the patient card.
 */
import type { InsightTile } from '../src/components/dashboard/InsightsGrid';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';

export const MOCK_PROFILE: PersonProfile = {
  id: 'mock-patient-1',
  displayName: 'Mary Smith',
  relationship: 'primary carer',
  ageRange: '82 years old',
  existingMemoryIssues: true,
  recentSurgery: false,
  recentInfection: false,
  normalSleepMin: 6,
  normalSleepMax: 8,
  normalConfusionBaseline: 2,
  normalMobility: 'Assisted walking',
  // updatedAt = today at 9:20 am → PatientCard shows "Today, 9:20 am"
  updatedAt: '2026-05-04T09:20:00Z',
};

/** 7 days of logs: Sat 26 Apr → today (Sun 4 May). */
export const MOCK_LOGS: LogEntry[] = [
  { id: 'log-d7', date: '2026-04-27', agitation: 2, confusion: 1, sleepHours: 7 },
  { id: 'log-d6', date: '2026-04-28', agitation: 1, confusion: 2, sleepHours: 7.5 },
  { id: 'log-d5', date: '2026-04-29', agitation: 5, confusion: 4, sleepHours: 4, hydrationConcern: true },
  { id: 'log-d4', date: '2026-04-30', agitation: 2, confusion: 2, sleepHours: 7 },
  { id: 'log-d3', date: '2026-05-01', agitation: 3, confusion: 2, sleepHours: 6.5 },
  { id: 'log-d2', date: '2026-05-02', agitation: 1, confusion: 1, sleepHours: 8 },
  { id: 'log-today', date: '2026-05-04', agitation: 2, confusion: 1, sleepHours: 7.5 },
];

export const MOCK_INSIGHTS: InsightTile[] = [
  { id: 'sleep-pattern', icon: 'moon',  title: 'Best sleep',       sub: 'Mon, Wed', variant: 'purple' },
  { id: 'morning-calm',  icon: 'sun',   title: 'Calmer mornings',  sub: 'Usually',  variant: 'yellow' },
  { id: 'hydration',     icon: 'water', title: 'Hydration helps',  sub: 'Keep it up', variant: 'blue' },
];
