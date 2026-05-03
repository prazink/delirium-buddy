/**
 * PII-safe logger. In non-dev builds, all context/args are stripped so patient
 * data can never leak into crash reporters or console output.
 */
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug(...args: unknown[]): void {
    if (isDev) console.log('[debug]', ...args);
  },
  info(msg: string): void {
    if (isDev) console.info('[info]', msg);
  },
  warn(msg: string): void {
    if (isDev) console.warn('[warn]', msg);
  },
  /** Pass only non-PII identifiers (e.g. key names, error codes) as context. */
  error(msg: string, context?: Record<string, string>): void {
    if (isDev) {
      console.error('[error]', msg, context);
    } else {
      console.error('[error]', msg);
    }
  },
};
