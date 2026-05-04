export type FourAtArousalScore = 0 | 4;
export type FourAtAmt4Score = 0 | 1 | 2;
export type FourAtAttentionScore = 0 | 1 | 2;
export type FourAtAcuteChangeScore = 0 | 4;

export type FourAtAssessorRole = 'family_carer' | 'nurse' | 'clinician' | 'other';

export type FourAtScreening = {
  arousal: FourAtArousalScore;
  amt4: FourAtAmt4Score;
  attention: FourAtAttentionScore;
  acuteChange: FourAtAcuteChangeScore;
  completedAt?: string | undefined;
  assessorRole?: FourAtAssessorRole | undefined;
  notes?: string | undefined;
};

export type FourAtBand =
  | 'unlikely_delirium_or_cognitive_impairment'
  | 'possible_cognitive_impairment'
  | 'possible_delirium';

export type FourAtResult = {
  totalScore: number;
  band: FourAtBand;
  statusLabel: string;
  summary: string;
  recommendedAction: string;
  isPositiveScreen: boolean;
  flags: string[];
  safetyNote: string;
};

const SAFETY_NOTE =
  'This is a structured screening support result only. It is not a diagnosis and does not replace assessment by an appropriately trained clinician.';

/**
 * Scores the four 4AT domains without reproducing the full clinical instrument text.
 * Use only where a service has approved 4AT use and staff are trained/competent.
 */
export function scoreFourAt(screening: FourAtScreening): FourAtResult {
  const totalScore =
    screening.arousal +
    screening.amt4 +
    screening.attention +
    screening.acuteChange;

  const flags = buildFlags(screening);

  if (totalScore >= 4) {
    return {
      totalScore,
      band: 'possible_delirium',
      statusLabel: 'Possible delirium screen',
      summary: '4AT score is 4 or above, which should prompt timely clinical review using the local delirium pathway.',
      recommendedAction:
        'Escalate according to the local care pathway and document the result, context and any acute change information.',
      isPositiveScreen: true,
      flags,
      safetyNote: SAFETY_NOTE,
    };
  }

  if (totalScore >= 1) {
    return {
      totalScore,
      band: 'possible_cognitive_impairment',
      statusLabel: 'Possible cognitive impairment screen',
      summary: '4AT score is 1 to 3, which may indicate cognitive impairment and should be documented for monitoring.',
      recommendedAction:
        'Record as a baseline-style screening result and repeat or escalate according to the local policy if behaviour changes.',
      isPositiveScreen: false,
      flags,
      safetyNote: SAFETY_NOTE,
    };
  }

  return {
    totalScore,
    band: 'unlikely_delirium_or_cognitive_impairment',
    statusLabel: 'No 4AT concern recorded',
    summary: '4AT score is 0. Continue routine observation and repeat screening if there is an acute change.',
    recommendedAction:
      'Continue usual observation and document any family/carer concerns about changes from normal behaviour.',
    isPositiveScreen: false,
    flags,
    safetyNote: SAFETY_NOTE,
  };
}

function buildFlags(screening: FourAtScreening): string[] {
  const flags: string[] = [];

  if (screening.arousal > 0) {
    flags.push('Altered alertness / arousal recorded');
  }

  if (screening.amt4 > 0) {
    flags.push('AMT4 difficulty recorded');
  }

  if (screening.attention > 0) {
    flags.push('Attention difficulty recorded');
  }

  if (screening.acuteChange > 0) {
    flags.push('Acute change or fluctuating course recorded');
  }

  return flags;
}
