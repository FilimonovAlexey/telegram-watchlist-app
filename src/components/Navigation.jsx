import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ canEdit }) {
  return (
    <nav className="navigation">
      <div className="nav-row">
        <Link to="/" className="nav-button home-button">
          <span role="img" aria-label="home">🏠</span>
        </Link>
        <Link to="/movies" className="nav-button">Фильмы</Link>
        <Link to="/series" className="nav-button">Сериалы</Link>
      </div>
      {canEdit && (
        <div className="nav-row">
          <Link to="/add" className="nav-button add-button" style={{ width: '100%' }}>Добавить</Link>
        </div>
      )}
      <div className="nav-row">
        <Link to="/evening" className="nav-button evening-button">Фильм на вечер</Link>
      </div>
    </nav>
  );
}