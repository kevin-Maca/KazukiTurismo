import { useAccommodations } from './useAccommodations';

export function useSelectedAccommodation() {
  const { accommodations, loading, error } = useAccommodations();
  const id = sessionStorage.getItem('selectedCabinId');
  const selectedCabin = accommodations.find((c) => c.id === id);
  return { selectedCabin, loading, error };
}