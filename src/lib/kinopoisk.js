const KINOPOISK_API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie/search';
const DETAILS_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';

console.log('Environment check:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  API_KEY_LENGTH: import.meta.env.VITE_KINOPOISK_API_KEY?.length,
});

export const searchKinopoisk = async (query) => {
  if (!query || query.length < 2) return []; // Начинаем поиск от 2 символов
  
  // Добавляем отладочную информацию
  console.log('API Key:', KINOPOISK_API_KEY);
  console.log('Search Query:', query);
  
  try {
    const normalizedQuery = query.trim().toLowerCase(); // Нормализуем запрос
    
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

    // Добавляем отладку ответа
    console.log('Search Response status:', response.status);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    if (!data.docs || !data.docs.length) {
      console.log('No results found');
      return [];
    }

    // Получаем детальную информацию для каждого фильма
    const detailedResults = await Promise.all(
      data.docs.slice(0, 5).map(async (movie) => {
        try {
          const detailsResponse = await fetch(
            `${DETAILS_URL}/${movie.id}`,
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
            id: movie.id,
            title: movie.name || movie.alternativeName,
            type: movie.type === 'movie' ? 'movie' : 'series',
            year: movie.year,
            rating: movie.rating?.kp,
            release_date: movie.premiere?.world || movie.premiere?.russia,
            seasons_count: movie.seasonsInfo?.length || null,
            genres: movie.genres?.map(g => g.name) || [],
          };
        } catch (error) {
          console.error('Error fetching details for film:', movie.id, error);
          return null;
        }
      })
    );

    return detailedResults.filter(Boolean);

  } catch (error) {
    console.error('Error searching Kinopoisk:', error);
    if (error.message.includes('401')) {
      console.error('API Key issue. Please check your API key');
    }
    return [];
  }
}; 