
export type LogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  agitation: number; // 0-10
  confusion: number; // 0-10
  sleepHours: number; // 0-24
  medsChanged?: boolean;
  feverOrInfection?: boolean;
  notes?: string;
};

export type User = {
  id: string;
  name: string;
};
