
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
