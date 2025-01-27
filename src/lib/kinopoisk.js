const KINOPOISK_API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword';

export const searchKinopoisk = async (query) => {
  if (!query || query.length < 2) return []; // Начинаем поиск от 2 символов
  
  try {
    const normalizedQuery = query.trim().toLowerCase(); // Нормализуем запрос
    
    const response = await fetch(
      `${BASE_URL}?keyword=${encodeURIComponent(normalizedQuery)}`, 
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
    
    if (!data.films) {
      console.log('No results found');
      return [];
    }

    // Фильтруем и преобразуем результаты
    return data.films
      .filter(film => film.nameRu || film.nameEn) // Убираем результаты без названия
      .map(film => ({
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