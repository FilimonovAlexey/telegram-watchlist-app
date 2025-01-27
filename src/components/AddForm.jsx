import React, { useState, useEffect } from "react";
import { searchKinopoisk } from '../lib/kinopoisk';

export default function AddForm({ onAddItem }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [status, setStatus] = useState("Будем смотреть");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (title.length >= 3) {
        setIsLoading(true);
        const results = await searchKinopoisk(title);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 500); // Задержка для избежания частых запросов

    return () => clearTimeout(searchTimeout);
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({ title, type, status });
    setTitle("");
    setType("movie");
    setStatus("Будем смотреть");
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setTitle(suggestion.title);
    setType(suggestion.type);
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Начните вводить название..."
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
                  <span className="suggestion-title">{suggestion.title}</span>
                  <span className="suggestion-year">({suggestion.year})</span>
                  {suggestion.rating && (
                    <span className="suggestion-rating">★ {suggestion.rating}</span>
                  )}
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
    </div>
  );
}