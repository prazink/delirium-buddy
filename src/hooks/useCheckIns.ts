import { useEffect } from 'react';

import { useCheckInStore } from '../stores/checkInStore';

/**
 * Loads check-in logs on first mount and returns them with load state.
 * @example const { logs, isLoaded } = useCheckIns();
 */
export function useCheckIns() {
  const logs = useCheckInStore((s) => s.logs);
  const isLoaded = useCheckInStore((s) => s.isLoaded);
  const loadLogs = useCheckInStore((s) => s.loadLogs);

  useEffect(() => {
    if (!isLoaded) {
      void loadLogs();
    }
  }, [isLoaded, loadLogs]);

  return { logs, isLoaded };
}
