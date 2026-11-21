import React from 'react';
import { AccommodationCard } from './AccommodationCard';
import type { Accommodation } from '../types';

interface AccommodationGridProps {
  accommodations: Accommodation[];
  loading: boolean;
  error: string | null;
  variant?: 'compact' | 'detailed';
}

export const AccommodationGrid: React.FC<AccommodationGridProps> = ({
  accommodations,
  loading,
  error,
  variant = 'compact',
}) => {
  if (loading) return <p className="acc-status">Cargando alojamientos...</p>;

  if (error) {
    return (
      <p role="alert" className="acc-status acc-status--error">
        {error}
      </p>
    );
  }

  if (accommodations.length === 0) {
    return <p className="acc-status">Aún no hay alojamientos disponibles.</p>;
  }

  return (
    <div className="acc-grid">
      {accommodations.map((accommodation, index) => (
        <AccommodationCard
          key={accommodation.id}
          accommodation={accommodation}
          variant={variant}
          index={index}
        />
      ))}
    </div>
  );
};