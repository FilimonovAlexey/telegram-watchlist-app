const KINOPOISK_API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const SEARCH_URL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword';
const DETAILS_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';

export const searchKinopoisk = async (query) => {
  if (!query || query.length < 2) return []; // Начинаем поиск от 2 символов
  
  // Добавляем отладочную информацию
  console.log('API Key:', KINOPOISK_API_KEY);
  console.log('Search Query:', query);
  
  try {
    const normalizedQuery = query.trim().toLowerCase(); // Нормализуем запрос
    
    const response = await fetch(
      `${SEARCH_URL}?keyword=${encodeURIComponent(normalizedQuery)}`, 
      {
        method: 'GET',
        headers: {
          'X-API-KEY': KINOPOISK_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Добавляем отладку ответа
    console.log('Search Response status:', response.status);
    const data = await response.json();
    console.log('Search API Response:', data);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!data.films) {
      console.log('No results found');
      return [];
    }

    // Получаем детальную информацию для каждого фильма
    const detailedResults = await Promise.all(
      data.films.slice(0, 5).map(async (film) => {
        try {
          const detailsResponse = await fetch(
            `${DETAILS_URL}/${film.filmId}`,
            {
              headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
              },
            }
          );
          const details = await detailsResponse.json();
          console.log('Details for film:', details);

          return {
            id: film.filmId,
            title: film.nameRu || film.nameEn,
            type: film.type === 'FILM' ? 'movie' : 'series',
            year: film.year,
            rating: film.rating,
            releaseDate: details.premiereRu || details.premiereWorld,
            seasonsCount: details.serial ? details.seasonsInfo?.length : null,
            genres: details.genres?.map(g => g.genre) || [],
          };
        } catch (error) {
          console.error('Error fetching details for film:', film.filmId, error);
          return null;
        }
      })
    );

    return detailedResults.filter(Boolean);

  } catch (error) {
    console.error('Error searching Kinopoisk:', error);
    return [];
  }
}; 