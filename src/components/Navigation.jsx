import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ canEdit }) {
  return (
    <nav className="navigation">
      <div className="nav-row">
        <Link to="/" className="nav-button home-button">
          🏠
        </Link>
        <Link to="/movies" className="nav-button">
          Фильмы
        </Link>
        <Link to="/series" className="nav-button">
          Сериалы
        </Link>
      </div>
      <div className="nav-row secondary">
        <Link to="/history" className="nav-button history-button">
          История
        </Link>
        {canEdit && (
          <Link to="/add" className="nav-button add-button">
            Добавить
          </Link>
        )}
      </div>
    </nav>
  );
}