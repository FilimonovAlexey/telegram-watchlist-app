import React from "react";

export default function MovieSeriesList({ items, onChangeStatus, canEdit }) {
  console.log('MovieSeriesList items:', items); // Отладочный вывод

  const handleSelectChange = (e, id) => {
    const newStatus = e.target.value;
    onChangeStatus(id, newStatus);
  };

  const handlePosterClick = (id) => {
    window.open(`https://www.kinopoisk.ru/film/${id}`, '_blank');
  };

  const filteredItems = items.filter(item => item.status !== 'Удалить');

  if (filteredItems.length === 0) {
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
        {filteredItems.map((item) => {
          console.log('Rendering item:', item); // Отладочный вывод для каждого элемента
          
          return (
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
                    {canEdit ? (
                      <select
                        value={item.status}
                        onChange={(e) => handleSelectChange(e, item.id)}
                        className="status-select"
                      >
                        <option value="Будем смотреть">Будем смотреть</option>
                        <option value="Смотрим">Смотрим</option>
                        <option value="Посмотрели">Посмотрели</option>
                        <option value="Удалить">Удалить</option>
                      </select>
                    ) : (
                      <span className="status-text">{item.status}</span>
                    )}
                  </div>
                  
                  <div className="item-details">
                    {item.year && (
                      <span className="detail-item">
                        📅 {item.year}
                      </span>
                    )}
                    
                    {item.countries && item.countries.length > 0 && (
                      <span className="detail-item">
                        🌍 {item.countries.slice(0, 2).join(', ')}
                      </span>
                    )}
                    
                    {item.genres && item.genres.length > 0 && (
                      <span className="detail-item genres">
                        🎭 {item.genres.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}