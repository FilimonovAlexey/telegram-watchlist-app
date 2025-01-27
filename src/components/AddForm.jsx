import React, { useState } from "react";

export default function AddForm({ onAddItem }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [status, setStatus] = useState("Будем смотреть");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({ title, type, status });
    setTitle("");
    setType("movie");
    setStatus("Будем смотреть");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Добавить Фильм/Сериал</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <label>
          Название:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
          />
        </label>
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