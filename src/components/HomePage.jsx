import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ items }) {
  const movies = items
    .filter((item) => item.type === "movie" && item.status !== "Удалить")
    .slice(0, 5);
  
  const series = items
    .filter((item) => item.type === "series" && item.status !== "Удалить")
    .slice(0, 5);

  const totalMovies = items.filter(
    (item) => item.type === "movie" && item.status !== "Удалить"
  ).length;
  
  const totalSeries = items.filter(
    (item) => item.type === "series" && item.status !== "Удалить"
  ).length;

  const handlePosterClick = (id) => {
    window.open(`https://www.kinopoisk.ru/film/${id}`, "_blank");
  };

  return (
    <div className="home-page">
      <div className="category-section">
        <div className="category-header">
          <h2>Фильмы</h2>
          {totalMovies > 5 && (
            <Link to="/movies" className="see-more-link">
              Ещё {totalMovies - 5} →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {movies.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-content">
                {item.poster && (
                  <div 
                    className="item-poster clickable"
                    onClick={() => handlePosterClick(item.id)}
                    title="Открыть на Кинопоиске"
                  >
                    <img src={item.poster} alt={item.title} />
                  </div>
                )}
                <div className="item-info">
                  <div className="item-main">
                    <span className="title">{item.title}</span>
                    <span className="status-text">{item.status}</span>
                  </div>
                  <div className="item-details">
                    {item.year && <span className="detail-item">📅 {item.year}</span>}
                    {item.countries && item.countries.length > 0 && (
                      <span className="detail-item">🌍 {item.countries.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="category-section">
        <div className="category-header">
          <h2>Сериалы</h2>
          {totalSeries > 5 && (
            <Link to="/series" className="see-more-link">
              Ещё {totalSeries - 5} →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {series.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-content">
                {item.poster && (
                  <div 
                    className="item-poster clickable"
                    onClick={() => handlePosterClick(item.id)}
                    title="Открыть на Кинопоиске"
                  >
                    <img src={item.poster} alt={item.title} />
                  </div>
                )}
                <div className="item-info">
                  <div className="item-main">
                    <span className="title">{item.title}</span>
                    <span className="status-text">{item.status}</span>
                  </div>
                  <div className="item-details">
                    {item.year && <span className="detail-item">📅 {item.year}</span>}
                    {item.countries && item.countries.length > 0 && (
                      <span className="detail-item">🌍 {item.countries.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 