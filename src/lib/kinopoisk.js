const KINOPOISK_API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword';

export const searchKinopoisk = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${BASE_URL}?keyword=${encodeURIComponent(query)}`, {
      headers: {
        'X-API-KEY': KINOPOISK_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.films.map(film => ({
      id: film.filmId,
      title: film.nameRu || film.nameEn,
      type: film.type === 'FILM' ? 'movie' : 'series',
      year: film.year,
      rating: film.rating,
    }));
  } catch (error) {
    console.error('Error searching Kinopoisk:', error);
    return [];
  }
}; 