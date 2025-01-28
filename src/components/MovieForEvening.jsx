import React, { useState, useEffect } from 'react';
import { searchRandomMovie } from '../lib/kinopoisk';

export default function MovieForEvening() {
  const [filters, setFilters] = useState({
    yearFrom: 2000,
    yearTo: new Date().getFullYear(),
    genre: '',
    country: '',
    type: 'movie'
  });
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(true);

  // Загрузка жанров и стран при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresList, countriesList] = await Promise.all([
          searchRandomMovie.getGenres(),
          searchRandomMovie.getCountries()
        ]);
        setGenres(genresList);
        setCountries(countriesList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Не удалось загрузить списки жанров и стран');
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomMovie = await searchRandomMovie.getRandomMovie(filters);
      setMovie(randomMovie);
      setIsSearchMode(false);
    } catch (error) {
      setError('Не удалось найти фильм. Попробуйте изменить параметры поиска.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMovie(null);
    setIsSearchMode(true);
  };

  const handlePosterClick = (id) => {
    window.open(`https://www.kinopoisk.ru/film/${id}`, '_blank');
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="movie-evening-container">
      {isSearchMode ? (
        <div className="filters-container">
          <h2>Фильм на вечер</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="filter-group">
            <label>
              Год от:
              <input
                type="number"
                min="1900"
                max={filters.yearTo}
                value={filters.yearFrom}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearFrom: parseInt(e.target.value)
                }))}
              />
            </label>
            
            <label>
              до:
              <input
                type="number"
                min={filters.yearFrom}
                max={new Date().getFullYear()}
                value={filters.yearTo}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearTo: parseInt(e.target.value)
                }))}
              />
            </label>
          </div>

          <div className="filter-group">
            <label>
              Жанр:
              <select
                value={filters.genre}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  genre: e.target.value
                }))}
              >
                <option value="">Любой</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Страна:
              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  country: e.target.value
                }))}
              >
                <option value="">Любая</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Тип:
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                <option value="movie">Фильм</option>
                <option value="series">Сериал</option>
              </select>
            </label>
          </div>

          <button className="search-button" onClick={handleSearch}>
            Найти
          </button>
        </div>
      ) : (
        <div className="movie-card">
          {movie && (
            <>
              <div 
                className="movie-poster clickable"
                onClick={() => handlePosterClick(movie.id)}
                title="Открыть на Кинопоиске"
              >
                <img src={movie.poster} alt={movie.title} />
              </div>
              <div className="movie-info">
                <h2>{movie.title}</h2>
                <div className="movie-details">
                  <p>Год: {movie.year}</p>
                  <p>Страна: {movie.countries.join(', ')}</p>
                  <p>Рейтинг: ⭐ {movie.rating}</p>
                </div>
                <div className="movie-description">
                  <p>{movie.description}</p>
                </div>
              </div>
              <button className="search-again-button" onClick={handleReset}>
                Поискать ещё
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 