export type LogEntry = {
  id: string;
  date: string;
  agitation: number;
  confusion: number;
  sleepHours: number;
  medsChanged?: boolean | undefined;
  feverOrInfection?: boolean | undefined;
  hydrationConcern?: boolean | undefined;
  eatingConcern?: boolean | undefined;
  painConcern?: boolean | undefined;
  mobilityConcern?: boolean | undefined;
  hallucination?: boolean | undefined;
  fallOrNearFall?: boolean | undefined;
  urineInfectionConcern?: boolean | undefined;
  glassesOrHearingAidsMissing?: boolean | undefined;
  suddenChange?: boolean | undefined;
  notes?: string | undefined;
};

export type User = {
  id: string;
  name: string;
};

export type PersonProfile = {
  id: string;
  displayName: string;
  relationship: string;
  ageRange?: string | undefined;
  existingMemoryIssues?: boolean | undefined;
  recentSurgery?: boolean | undefined;
  recentInfection?: boolean | undefined;
  normalSleepMin?: number | undefined;
  normalSleepMax?: number | undefined;
  normalConfusionBaseline?: number | undefined;
  normalMobility?: string | undefined;
  updatedAt: string;
};
