import { useEffect } from 'react';

import { usePatientStore } from '../stores/patientStore';

/**
 * Loads patient profile on first mount and returns it with load state.
 * @example const { profile, isLoaded } = usePatient();
 */
export function usePatient() {
  const profile = usePatientStore((s) => s.profile);
  const isLoaded = usePatientStore((s) => s.isLoaded);
  const loadProfile = usePatientStore((s) => s.loadProfile);

  useEffect(() => {
    if (!isLoaded) {
      void loadProfile();
    }
  }, [isLoaded, loadProfile]);

  return { profile, isLoaded };
}
