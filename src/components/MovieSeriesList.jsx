import React from "react";

export default function MovieSeriesList({ items, onChangeStatus, canEdit }) {
  console.log('MovieSeriesList items:', items); // Отладочный вывод

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
        {items.map((item) => {
          console.log('Rendering item:', item); // Отладочный вывод для каждого элемента
          
          return (
            <li key={item.id} className="item-card">
              <div className="item-main">
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
              </div>
              
              <div className="item-details">
                {item.release_date && (
                  <span className="detail-item">
                    📅 {new Date(item.release_date).toLocaleDateString()}
                  </span>
                )}
                
                {item.type === 'series' && item.seasons_count && (
                  <span className="detail-item">
                    📺 {item.seasons_count} сезон{item.seasons_count > 1 ? 'ов' : ''}
                  </span>
                )}
                
                {item.genres && item.genres.length > 0 && (
                  <span className="detail-item genres">
                    🎭 {item.genres.slice(0, 3).join(', ')}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}