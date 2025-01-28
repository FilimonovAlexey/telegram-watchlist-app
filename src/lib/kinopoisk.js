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

export const searchRandomMovie = {
  getGenres: async () => {
    try {
      const response = await fetch(
        'https://api.kinopoisk.dev/v1/movie/possible-values-by-field?field=genres.name',
        {
          headers: {
            'X-API-KEY': KINOPOISK_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch genres');
      
      const data = await response.json();
      return data.map(genre => genre.name);
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  },

  getCountries: async () => {
    try {
      const response = await fetch(
        'https://api.kinopoisk.dev/v1/movie/possible-values-by-field?field=countries.name',
        {
          headers: {
            'X-API-KEY': KINOPOISK_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch countries');
      
      const data = await response.json();
      return data.map(country => country.name);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  getRandomMovie: async (filters) => {
    try {
      let url = 'https://api.kinopoisk.dev/v1.4/movie';
      
      const params = new URLSearchParams({
        'year': `${filters.yearFrom}-${filters.yearTo}`,
        'type': filters.type === 'series' ? 'tv-series' : 'movie',
        'page': '1',
        'limit': '100'
      });

      if (filters.genre) {
        params.append('genres.name', filters.genre);
      }

      if (filters.country) {
        params.append('countries.name', filters.country);
      }

      const response = await fetch(`${url}?${params}`, {
        headers: {
          'X-API-KEY': KINOPOISK_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();
      
      if (!data.docs || data.docs.length === 0) {
        throw new Error('No movies found');
      }

      // Выбираем случайный фильм из результатов
      const randomIndex = Math.floor(Math.random() * data.docs.length);
      const movie = data.docs[randomIndex];

      return {
        id: movie.id,
        title: movie.name || movie.alternativeName,
        year: movie.year,
        rating: movie.rating?.kp?.toFixed(1) || 'Нет данных',
        countries: movie.countries?.map(c => c.name) || ['Нет данных'],
        description: movie.description || 'Описание отсутствует',
        poster: movie.poster?.url || null
      };
    } catch (error) {
      console.error('Error fetching random movie:', error);
      throw error;
    }
  }
}; 