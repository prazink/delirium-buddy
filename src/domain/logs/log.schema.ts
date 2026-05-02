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
  notes: z.string().max(1000).optional(),
});

export const LogEntriesSchema = z.array(LogEntrySchema);

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
});
