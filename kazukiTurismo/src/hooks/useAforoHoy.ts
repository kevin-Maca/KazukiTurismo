import { useEffect, useState } from 'react';
import { fechaService } from '../services/fechaService';
import type { Accommodation, FechaDisponible } from '../types';

const getToday = (): string => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

export function useAforoHoy(accommodations: Accommodation[]) {
  const [today] = useState<string>(getToday);
  const [byAccommodation, setByAccommodation] = useState<Record<string, FechaDisponible | undefined>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accommodations.length === 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(accommodations.map((a) => fechaService.list(Number(a.id))))
      .then((lists) => {
        if (cancelled) return;

        const next: Record<string, FechaDisponible | undefined> = {};
        accommodations.forEach((a, i) => {
          next[a.id] = lists[i].find((f) => f.date === today && f.enabled);
        });
        setByAccommodation(next);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accommodations, today]);

  const open = Object.values(byAccommodation).filter(
    (f): f is FechaDisponible => f !== undefined
  );
  const totalCapacity = open.reduce((sum, f) => sum + f.capacity, 0);
  const totalReserved = open.reduce((sum, f) => sum + f.reserved, 0);
  const occupancy = totalCapacity > 0 ? Math.round((totalReserved / totalCapacity) * 100) : 0;

  return { today, byAccommodation, loading, error, totalCapacity, totalReserved, occupancy };
}