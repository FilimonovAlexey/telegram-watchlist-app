import React from 'react';
import AddForm from './AddForm';
import MovieSeriesList from './MovieSeriesList';

export default function DevPage({ items, onAddItem, onChangeStatus }) {
  return (
    <div className="dev-page">
      <h1>Тестовая страница разработчика</h1>
      
      <section className="dev-section">
        <h2>Форма добавления</h2>
        <AddForm onAddItem={onAddItem} />
      </section>

      <section className="dev-section">
        <h2>Фильмы</h2>
        <MovieSeriesList
          items={items.filter(item => item.type === 'movie')}
          onChangeStatus={onChangeStatus}
          canEdit={true}
        />
      </section>

      <section className="dev-section">
        <h2>Сериалы</h2>
        <MovieSeriesList
          items={items.filter(item => item.type === 'series')}
          onChangeStatus={onChangeStatus}
          canEdit={true}
        />
      </section>
    </div>
  );
} 