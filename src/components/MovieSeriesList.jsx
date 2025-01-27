import React from "react";

export default function MovieSeriesList({ items, onChangeStatus, canEdit }) {
  const handleSelectChange = (e, id) => {
    const newStatus = e.target.value;
    onChangeStatus(id, newStatus);
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Список пуст</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Список ({items[0]?.type === "movie" ? "Фильмы" : "Сериалы"})</h2>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item">
            <span className="title">{item.title}</span>
            {canEdit ? (
              <select
                value={item.status}
                onChange={(e) => handleSelectChange(e, item.id)}
                className="status-select"
              >
                <option value="Будем смотреть">Будем смотреть</option>
                <option value="Смотрим">Смотрим</option>
                <option value="Посмотрели">Посмотрели</option>
              </select>
            ) : (
              <span className="status-text">{item.status}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}