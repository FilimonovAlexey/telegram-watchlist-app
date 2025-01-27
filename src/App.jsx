import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import MovieSeriesList from "./components/MovieSeriesList";
import AddForm from "./components/AddForm";

const ALLOWED_USER_IDS = [364609948, 987654321];

function getTelegramUserId() {
  const initData = window.Telegram.WebApp.initDataUnsafe;
  return initData?.user?.id; 
}

export default function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    // Пример начальных данных
    { id: 1, title: "Inception", type: "movie", status: "Будем смотреть" },
    { id: 2, title: "The Matrix", type: "movie", status: "Смотрим" },
    { id: 3, title: "Breaking Bad", type: "series", status: "Будем смотреть" },
  ]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Имитируем получение userId
    const id = getTelegramUserId();
    setUserId(id);

    // Инициализация Telegram WebApp (если нужно)
    // if (window.Telegram?.WebApp) {
    //   window.Telegram.WebApp.ready();
    // }
  }, []);

  const handleChangeStatus = (id, newStatus) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
        // Если статус "Посмотрели" — удаляем фильм/сериал
        .filter((item) => item.status !== "Посмотрели")
    );
  };

  const handleAddItem = (newItem) => {
    const maxId = items.reduce((acc, curr) => (curr.id > acc ? curr.id : acc), 0);
    const itemToAdd = {
      ...newItem,
      id: maxId + 1,
    };
    setItems((prev) => [...prev, itemToAdd]);
    navigate("/"); // После добавления — переход на главную (или куда нужно)
  };

  const canEdit = ALLOWED_USER_IDS.includes(userId);

  return (
    <div className="app-container">
      {/* Навигация (Фильмы / Сериалы / Добавить) */}
      <Navigation canEdit={canEdit} />

      {/* Роутинг */}
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "1rem" }}>
              <h2>Главная страница</h2>
              <p>Добро пожаловать! Нажмите в меню «Фильмы» или «Сериалы».</p>
            </div>
          }
        />
        <Route
          path="/movies"
          element={
            <MovieSeriesList
              items={items.filter((item) => item.type === "movie")}
              onChangeStatus={handleChangeStatus}
            />
          }
        />
        <Route
          path="/series"
          element={
            <MovieSeriesList
              items={items.filter((item) => item.type === "series")}
              onChangeStatus={handleChangeStatus}
            />
          }
        />
        {canEdit && (
          <Route path="/add" element={<AddForm onAddItem={handleAddItem} />} />
        )}
        <Route
          path="*"
          element={
            <div style={{ padding: "1rem" }}>
              <h2>Страница не найдена</h2>
            </div>
          }
        />
      </Routes>
    </div>
  );
}