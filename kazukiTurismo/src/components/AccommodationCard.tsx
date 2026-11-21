import React from 'react';
import { Link } from 'react-router-dom';
import type { Accommodation } from '../types';

interface AccommodationCardProps {
  accommodation: Accommodation;
  variant?: 'compact' | 'detailed';
  index?: number;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  variant = 'compact',
  index,
}) => {
  const { name, subtitle, description, price, maxGuests, badge, image } = accommodation;
  const detailed = variant === 'detailed';

  // En la BD solo existe Descripcion, así que subtitle y description llegan iguales
  const showSubtitle = subtitle !== '' && subtitle !== description;

  return (
    <article className={`acc-card acc-card--${variant}`}>
      <div className="acc-card-media">
        <img src={image} alt={name} />

        {detailed && badge && <span className="acc-card-badge">{badge}</span>}

        {detailed && index !== undefined && (
          <span className="acc-card-index">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <div className="acc-card-body">
        <div>
          {showSubtitle && (
            <small className="acc-card-subtitle">{subtitle.toUpperCase()}</small>
          )}
          <h3>{name}</h3>
          <p className="acc-card-description">{description}</p>
        </div>

        <div>
          {detailed && (
            <div className="acc-card-features">
              <span>👥 Hasta {maxGuests} huéspedes</span>
              <span>🌲 Experiencia rural</span>
            </div>
          )}

          <div className="acc-card-footer">
            <div>
              <small className="acc-card-from">DESDE</small>
              <div className="acc-card-price">
                $ {price.toLocaleString()} <small>/ huésped · noche</small>
              </div>
            </div>

            <Link to="/reserva" className="acc-card-go" aria-label={`Reservar ${name}`}>
              &rarr;
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};