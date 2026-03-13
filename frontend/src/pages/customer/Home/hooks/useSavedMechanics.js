import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_PREFIX = 'hav_jeang_saved_mechanics';
const SYNC_EVENT = 'hav-jeang-saved-mechanics-sync';

const normalizeMechanic = (mechanic) => ({
  id: mechanic.id,
  name: mechanic.name || 'Unknown Mechanic',
  rating: Number(mechanic.rating ?? 0),
  totalReviews: Number(mechanic.totalReviews ?? 0),
  distance: Number.isFinite(Number(mechanic.distance))
    ? Number(mechanic.distance)
    : null,
  available: Boolean(mechanic.available),
  services: Array.isArray(mechanic.services) ? mechanic.services : [],
  workHours: mechanic.workHours || mechanic.working_hours || 'Hours not provided',
  phone: mechanic.phone || 'N/A',
  location: mechanic.location || 'Location not provided',
  trip_price: Number.isFinite(Number(mechanic.trip_price))
    ? Number(mechanic.trip_price)
    : null,
  responseTime: mechanic.responseTime || '~10 min',
  savedDate: new Date().toISOString(),
});

export const useSavedMechanics = () => {
  const { user } = useAuth();

  const storageKey = useMemo(
    () => `${STORAGE_PREFIX}_${user?.id ?? 'guest'}`,
    [user?.id],
  );

  const readSavedMechanics = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse saved mechanics:', error);
      return [];
    }
  }, [storageKey]);

  const [savedMechanics, setSavedMechanics] = useState(() => readSavedMechanics());

  const persistSavedMechanics = useCallback(
    (nextMechanics) => {
      localStorage.setItem(storageKey, JSON.stringify(nextMechanics));
      setSavedMechanics(nextMechanics);
      window.dispatchEvent(new Event(SYNC_EVENT));
    },
    [storageKey],
  );

  useEffect(() => {
    setSavedMechanics(readSavedMechanics());
  }, [readSavedMechanics]);

  useEffect(() => {
    const syncSavedMechanics = () => {
      setSavedMechanics(readSavedMechanics());
    };

    window.addEventListener('storage', syncSavedMechanics);
    window.addEventListener(SYNC_EVENT, syncSavedMechanics);

    return () => {
      window.removeEventListener('storage', syncSavedMechanics);
      window.removeEventListener(SYNC_EVENT, syncSavedMechanics);
    };
  }, [readSavedMechanics]);

  const toggleSaveMechanic = useCallback(
    (mechanic) => {
      if (!mechanic || !mechanic.id) return;

      const mechanicId = Number(mechanic.id);
      const exists = savedMechanics.some((item) => Number(item.id) === mechanicId);

      if (exists) {
        const next = savedMechanics.filter((item) => Number(item.id) !== mechanicId);
        persistSavedMechanics(next);
        return;
      }

      const next = [normalizeMechanic(mechanic), ...savedMechanics].slice(0, 100);
      persistSavedMechanics(next);
    },
    [persistSavedMechanics, savedMechanics],
  );

  const removeSavedMechanic = useCallback(
    (mechanicId) => {
      const next = savedMechanics.filter((item) => Number(item.id) !== Number(mechanicId));
      persistSavedMechanics(next);
    },
    [persistSavedMechanics, savedMechanics],
  );

  const isMechanicSaved = useCallback(
    (mechanicId) => savedMechanics.some((item) => Number(item.id) === Number(mechanicId)),
    [savedMechanics],
  );

  const savedMechanicIds = savedMechanics.map((item) => Number(item.id));

  return {
    savedMechanics,
    savedMechanicIds,
    toggleSaveMechanic,
    removeSavedMechanic,
    isMechanicSaved,
  };
};
