import { useEffect, useState } from 'react';
import { fechaService } from '../services/fechaService';
import type { FechaDisponible } from '../types';

// refreshKey permite volver a consultar después de un cambio
export function useFechasDisponibles(idAlojamiento: number | null, refreshKey = 0) {
  const [fechas, setFechas] = useState<FechaDisponible[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idAlojamiento === null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fechaService
      .list(idAlojamiento)
      .then((data) => {
        if (!cancelled) setFechas(data);
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
  }, [idAlojamiento, refreshKey]);

  return { fechas, loading, error };
}