const IMAGES: Record<string, string> = {
  'cabaña bosque': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  'cabaña río': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'cabaña montaña': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
};

const FALLBACK =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80';

export const getAccommodationImage = (name: string): string =>
  IMAGES[name.trim().toLowerCase()] ?? FALLBACK;