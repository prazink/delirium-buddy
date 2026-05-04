import { z } from 'zod';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const FourAtScreeningSchema = z.object({
  arousal: z.union([z.literal(0), z.literal(4)]),
  amt4: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  attention: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  acuteChange: z.union([z.literal(0), z.literal(4)]),
  completedAt: z.string().min(1).optional(),
  assessorRole: z.enum(['family_carer', 'nurse', 'clinician', 'other']).optional(),
  notes: z.string().max(1000).optional(),
});

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
  fourAt: FourAtScreeningSchema.optional(),
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
  careRole: z.string().trim().max(120).optional(),
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
