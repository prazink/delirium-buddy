import { create } from 'zustand';

import type { PersonProfile } from '../domain/logs/log.types';
import { logger } from '../lib/logger';
import {
  clearPersonProfile,
  loadPersonProfile,
  savePersonProfile,
} from '../storage/localProfileRepository';

interface PatientState {
  profile: PersonProfile | null;
  isLoaded: boolean;
  loadProfile: () => Promise<void>;
  saveProfile: (profile: PersonProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

/**
 * Zustand store for the current patient profile.
 * Persists via SecureStore — do not log profile fields directly.
 * @example const profile = usePatientStore(s => s.profile);
 */
export const usePatientStore = create<PatientState>((set) => ({
  profile: null,
  isLoaded: false,

  loadProfile: async () => {
    try {
      const profile = await loadPersonProfile();
      set({ profile, isLoaded: true });
    } catch {
      logger.error('patientStore: loadProfile failed');
      set({ isLoaded: true });
    }
  },

  saveProfile: async (profile) => {
    try {
      await savePersonProfile(profile);
      set({ profile });
    } catch {
      logger.error('patientStore: saveProfile failed');
      throw new Error('Could not save profile');
    }
  },

  clearProfile: async () => {
    try {
      await clearPersonProfile();
      set({ profile: null });
    } catch {
      logger.error('patientStore: clearProfile failed');
    }
  },
}));
