import { z } from 'zod';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const LogEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(isoDatePattern, 'Date must use YYYY-MM-DD format'),
  agitation: z.number().min(0).max(10),
  confusion: z.number().min(0).max(10),
  sleepHours: z.number().min(0).max(24),
  medsChanged: z.boolean().optional(),
  feverOrInfection: z.boolean().optional(),
  hydrationConcern: z.boolean().optional(),
  eatingConcern: z.boolean().optional(),
  painConcern: z.boolean().optional(),
  mobilityConcern: z.boolean().optional(),
  hallucination: z.boolean().optional(),
  fallOrNearFall: z.boolean().optional(),
  urineInfectionConcern: z.boolean().optional(),
  glassesOrHearingAidsMissing: z.boolean().optional(),
  suddenChange: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
});

export const LogEntriesSchema = z.array(LogEntrySchema);

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
});

export const PersonProfileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().trim().min(1).max(120),
  relationship: z.string().trim().min(1).max(120),
  ageRange: z.string().trim().max(80).optional(),
  existingMemoryIssues: z.boolean().optional(),
  recentSurgery: z.boolean().optional(),
  recentInfection: z.boolean().optional(),
  normalSleepMin: z.number().min(0).max(24).optional(),
  normalSleepMax: z.number().min(0).max(24).optional(),
  normalConfusionBaseline: z.number().min(0).max(10).optional(),
  normalMobility: z.string().trim().max(200).optional(),
  updatedAt: z.string().min(1),
});
