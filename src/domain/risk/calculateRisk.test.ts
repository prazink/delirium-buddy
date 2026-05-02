import { describe, expect, it } from 'vitest';

import { calculateRisk } from './calculateRisk';
import type { LogEntry } from '../logs/log.types';

function makeLog(overrides: Partial<LogEntry> = {}): LogEntry {
  const log: LogEntry = {
    id: overrides.id ?? '1',
    date: overrides.date ?? '2026-04-28',
    agitation: overrides.agitation ?? 2,
    confusion: overrides.confusion ?? 2,
    sleepHours: overrides.sleepHours ?? 7,
  };

  if (overrides.medsChanged !== undefined) {
    log.medsChanged = overrides.medsChanged;
  }

  if (overrides.feverOrInfection !== undefined) {
    log.feverOrInfection = overrides.feverOrInfection;
  }

  if (overrides.notes !== undefined) {
    log.notes = overrides.notes;
  }

  return log;
}

describe('calculateRisk', () => {
  it('returns No data when logs are empty', () => {
    expect(calculateRisk([])).toMatchObject({ level: 'No data', score: 0, reasons: [] });
  });

  it('returns Low for normal values', () => {
    const result = calculateRisk([makeLog()]);

    expect(result.level).toBe('Low');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThan(40);
  });

  it('returns Moderate for mixed warning signs', () => {
    const result = calculateRisk([
      makeLog({ agitation: 5, confusion: 5, sleepHours: 5, medsChanged: true }),
    ]);

    expect(result.level).toBe('Moderate');
  });

  it('returns High for strong warning signs', () => {
    const result = calculateRisk([
      makeLog({ agitation: 9, confusion: 9, sleepHours: 2, feverOrInfection: true }),
    ]);

    expect(result.level).toBe('High');
    expect(result.reasons).toContain('High agitation today');
    expect(result.reasons).toContain('High confusion today');
    expect(result.reasons).toContain('Very low sleep');
    expect(result.reasons).toContain('Fever or infection present');
  });

  it('adds a trend reason when agitation and confusion increase over recent logs', () => {
    const result = calculateRisk([
      makeLog({ id: '1', date: '2026-04-25', agitation: 1, confusion: 1 }),
      makeLog({ id: '2', date: '2026-04-26', agitation: 3, confusion: 3 }),
      makeLog({ id: '3', date: '2026-04-27', agitation: 6, confusion: 6 }),
      makeLog({ id: '4', date: '2026-04-28', agitation: 8, confusion: 8 }),
    ]);

    expect(result.reasons).toContain('Upward trend past 3 days');
  });

  it('clamps score between 0 and 100', () => {
    const result = calculateRisk([
      makeLog({
        agitation: 999,
        confusion: 999,
        sleepHours: -10,
        feverOrInfection: true,
        medsChanged: true,
      }),
    ]);

    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});
