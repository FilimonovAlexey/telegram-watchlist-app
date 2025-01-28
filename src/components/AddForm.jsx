import React, { useState, useEffect } from "react";
import { searchKinopoisk } from '../lib/kinopoisk';

export default function AddForm({ onAddItem }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [status, setStatus] = useState("Будем смотреть");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (title.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchKinopoisk(title);
          setSuggestions(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      title,
      type,
      status,
      year: selectedItem?.year,
      genres: selectedItem?.genres || [],
      countries: selectedItem?.countries || [],
      poster: selectedItem?.poster
    };

    onAddItem(newItem);
    setTitle("");
    setType("movie");
    setStatus("Будем смотреть");
    setSuggestions([]);
    setSelectedItem(null);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Selected suggestion:', suggestion); // Отладочный вывод
    setTitle(suggestion.title);
    setType(suggestion.type);
    setSelectedItem(suggestion);
    setSuggestions([]);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Добавить Фильм/Сериал</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="search-container">
          <label>
            Название:
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSelectedItem(null); // Сбрасываем выбранный элемент при изменении ввода
              }}
              placeholder="Введите минимум 2 символа..."
              className="search-input"
            />
          </label>
          {isLoading && <div className="loading-indicator">Поиск...</div>}
          
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <div className="suggestion-main">
                    <span className="suggestion-title">{suggestion.title}</span>
                    {suggestion.year && (
                      <span className="suggestion-year">({suggestion.year})</span>
                    )}
                  </div>
                  <div className="suggestion-details">
                    {suggestion.genres && suggestion.genres.length > 0 && (
                      <span className="suggestion-genres">
                        {suggestion.genres.slice(0, 2).join(', ')}
                      </span>
                    )}
                    {suggestion.rating && (
                      <span className="suggestion-rating">★ {suggestion.rating}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label>
          Тип:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="movie">Фильм</option>
            <option value="series">Сериал</option>
          </select>
        </label>

        <label>
          Статус:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Будем смотреть">Будем смотреть</option>
            <option value="Смотрим">Смотрим</option>
            <option value="Посмотрели">Посмотрели</option>
          </select>
        </label>

        <button type="submit" className="submit-button">
          Добавить
        </button>
      </form>

      {selectedItem && (
        <div className="selected-item-details">
          <p>Дата выхода: {selectedItem.release_date ? new Date(selectedItem.release_date).toLocaleDateString() : 'Нет данных'}</p>
          {selectedItem.type === 'series' && (
            <p>Количество сезонов: {selectedItem.seasons_count || 'Нет данных'}</p>
          )}
          <p>Жанры: {selectedItem.genres?.length > 0 ? selectedItem.genres.join(', ') : 'Нет данных'}</p>
        </div>
      )}
    </div>
  );
}