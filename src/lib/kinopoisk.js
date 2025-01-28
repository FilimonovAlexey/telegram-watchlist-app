const KINOPOISK_API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie/search';
const DETAILS_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';

console.log('Environment check:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  API_KEY_LENGTH: import.meta.env.VITE_KINOPOISK_API_KEY?.length,
});

export const searchKinopoisk = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const normalizedQuery = query.trim().toLowerCase();
    
    const response = await fetch(
      `${BASE_URL}?query=${encodeURIComponent(normalizedQuery)}`, 
      {
        method: 'GET',
        headers: {
          'X-API-KEY': KINOPOISK_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.docs || !data.docs.length) {
      return [];
    }

    return data.docs.map(movie => ({
      id: movie.id,
      title: movie.name || movie.alternativeName,
      type: movie.type === 'movie' ? 'movie' : 'series',
      year: movie.year,
      rating: movie.rating?.kp,
      genres: movie.genres?.map(g => g.name) || [],
      countries: movie.countries?.map(c => c.name) || [],
      poster: movie.poster?.previewUrl || movie.poster?.url || null
    }));

  } catch (error) {
    console.error('Error searching Kinopoisk:', error);
    return [];
  }
}; 