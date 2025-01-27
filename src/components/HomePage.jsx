import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ items }) {
  const movies = items
    .filter((item) => item.type === "movie" && item.status !== "Посмотрели")
    .slice(0, 5);
  
  const series = items
    .filter((item) => item.type === "series" && item.status !== "Посмотрели")
    .slice(0, 5);

  const hasMoreMovies = items.filter(
    (item) => item.type === "movie" && item.status !== "Посмотрели"
  ).length > 5;
  
  const hasMoreSeries = items.filter(
    (item) => item.type === "series" && item.status !== "Посмотрели"
  ).length > 5;

  return (
    <div style={{ padding: "1rem" }}>
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Фильмы</h2>
          {hasMoreMovies && (
            <Link to="/movies" className="see-more-link">
              Ещё →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {movies.map((item) => (
            <li key={item.id} className="item">
              <span className="title">{item.title}</span>
              <span className="status-text">{item.status}</span>
            </li>
          ))}
          {movies.length === 0 && (
            <li className="empty-message">Нет добавленных фильмов</li>
          )}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Сериалы</h2>
          {hasMoreSeries && (
            <Link to="/series" className="see-more-link">
              Ещё →
            </Link>
          )}
        </div>
        <ul className="item-list">
          {series.map((item) => (
            <li key={item.id} className="item">
              <span className="title">{item.title}</span>
              <span className="status-text">{item.status}</span>
            </li>
          ))}
          {series.length === 0 && (
            <li className="empty-message">Нет добавленных сериалов</li>
          )}
        </ul>
      </section>
    </div>
  );
} 