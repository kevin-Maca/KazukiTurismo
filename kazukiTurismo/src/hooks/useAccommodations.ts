import { useEffect, useState } from 'react';
import { alojamientoService } from '../services/alojamientoService';
import type { Accommodation } from '../types';

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    alojamientoService
      .list()
      .then((data) => {
        if (!cancelled) setAccommodations(data);
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
  }, []);

  return { accommodations, loading, error };
}