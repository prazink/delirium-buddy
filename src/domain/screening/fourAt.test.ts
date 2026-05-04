import { describe, expect, it } from 'vitest';

import { scoreFourAt } from './fourAt';

describe('scoreFourAt', () => {
  it('returns score 0 as no concern recorded', () => {
    const result = scoreFourAt({ arousal: 0, amt4: 0, attention: 0, acuteChange: 0 });

    expect(result.totalScore).toBe(0);
    expect(result.band).toBe('unlikely_delirium_or_cognitive_impairment');
    expect(result.isPositiveScreen).toBe(false);
    expect(result.flags).toEqual([]);
  });

  it('returns score 1 to 3 as possible cognitive impairment', () => {
    const result = scoreFourAt({ arousal: 0, amt4: 1, attention: 0, acuteChange: 0 });

    expect(result.totalScore).toBe(1);
    expect(result.band).toBe('possible_cognitive_impairment');
    expect(result.isPositiveScreen).toBe(false);
    expect(result.flags).toContain('AMT4 difficulty recorded');
  });

  it('returns score 4 or above as possible delirium screen', () => {
    const result = scoreFourAt({ arousal: 0, amt4: 0, attention: 0, acuteChange: 4 });

    expect(result.totalScore).toBe(4);
    expect(result.band).toBe('possible_delirium');
    expect(result.isPositiveScreen).toBe(true);
    expect(result.flags).toContain('Acute change or fluctuating course recorded');
    expect(result.safetyNote).toContain('not a diagnosis');
  });

  it('adds flags for each non-zero domain', () => {
    const result = scoreFourAt({ arousal: 4, amt4: 2, attention: 2, acuteChange: 4 });

    expect(result.totalScore).toBe(12);
    expect(result.flags).toEqual([
      'Altered alertness / arousal recorded',
      'AMT4 difficulty recorded',
      'Attention difficulty recorded',
      'Acute change or fluctuating course recorded',
    ]);
  });
});
