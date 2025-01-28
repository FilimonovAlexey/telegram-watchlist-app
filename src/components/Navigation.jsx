import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ canEdit }) {
  return (
    <nav className="navigation">
      <div className="nav-row">
        <Link to="/movies" className="nav-button">Фильмы</Link>
        <Link to="/series" className="nav-button">Сериалы</Link>
        <Link to="/evening" className="nav-button">Фильм на вечер</Link>
      </div>
      {canEdit && (
        <div className="nav-row secondary">
          <Link to="/" className="nav-button add-button">Добавить</Link>
        </div>
      )}
    </nav>
  );
}