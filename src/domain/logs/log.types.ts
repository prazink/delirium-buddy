export type LogEntry = {
  id: string;
  date: string;
  agitation: number;
  confusion: number;
  sleepHours: number;
  medsChanged?: boolean | undefined;
  feverOrInfection?: boolean | undefined;
  notes?: string | undefined;
};

export type User = {
  id: string;
  name: string;
};
