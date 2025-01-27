import React from 'react';
import { Link } from 'react-router-dom';

export default function WatchHistory({ items }) {
  const watchedMovies = items
    .filter(item => item.status === "Посмотрели" && item.type === "movie")
    .slice(0, 5);
  
  const watchedSeries = items
    .filter(item => item.status === "Посмотрели" && item.type === "series")
    .slice(0, 5);

  const hasMoreWatchedMovies = items.filter(
    item => item.status === "Посмотрели" && item.type === "movie"
  ).length > 5;
  
  const hasMoreWatchedSeries = items.filter(
    item => item.status === "Посмотрели" && item.type === "series"
  ).length > 5;

  return (
    <div style={{ padding: "1rem" }}>
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Просмотренные фильмы</h2>
          {hasMoreWatchedMovies && (
            <Link to="/watched/movies" className="see-more-link">
              Ещё →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {watchedMovies.map((item) => (
            <li key={item.id} className="item">
              <span className="title">{item.title}</span>
              <span className="watched-date">
                {new Date(item.updated_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {watchedMovies.length === 0 && (
            <li className="empty-message">Нет просмотренных фильмов</li>
          )}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Просмотренные сериалы</h2>
          {hasMoreWatchedSeries && (
            <Link to="/watched/series" className="see-more-link">
              Ещё →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {watchedSeries.map((item) => (
            <li key={item.id} className="item">
              <span className="title">{item.title}</span>
              <span className="watched-date">
                {new Date(item.updated_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {watchedSeries.length === 0 && (
            <li className="empty-message">Нет просмотренных сериалов</li>
          )}
        </ul>
      </section>
    </div>
  );
} 