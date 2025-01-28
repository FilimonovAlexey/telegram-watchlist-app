import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import MovieSeriesList from "./components/MovieSeriesList";
import AddForm from "./components/AddForm";
import { supabase } from './lib/supabase';
import HomePage from "./components/HomePage";
import WatchHistory from "./components/WatchHistory";
import DevPage from './components/DevPage';
import MovieForEvening from './components/MovieForEvening';

const ALLOWED_USER_IDS = [364609948, 210529767];

export default function App() {
  console.log('App component started rendering');
  
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const canEdit = true; // Временно установим true для отладки

  console.log('States initialized:', { items, error, isLoading, canEdit });

  function getTelegramUserId() {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      const userId = initData?.user?.id;
      console.log('Raw User ID:', userId);
      return userId ? Number(userId) : null;
    }
    return null;
  }

  useEffect(() => {
    console.log('Fetch effect started');
    const fetchItems = async () => {
      try {
        console.log('Fetching items from Supabase...');
        setIsLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('watchlist')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('Supabase response:', { data, error: supabaseError });

        if (supabaseError) throw supabaseError;

        setItems(data || []);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    const currentUserId = getTelegramUserId();
    setUserId(currentUserId);
    
    console.log('Current User ID:', currentUserId);
    console.log('Allowed User IDs:', ALLOWED_USER_IDS);
    console.log('Can Edit:', ALLOWED_USER_IDS.includes(currentUserId));
  }, []);

  const handleChangeStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Удалить') {
        // Удаляем запись из базы данных
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .match({ id });

        if (error) throw error;

        // Удаляем элемент из локального состояния
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        // Обновляем статус как обычно
        const { error } = await supabase
          .from('watchlist')
          .update({ status: newStatus })
          .match({ id });

        if (error) throw error;

        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      // Сначала проверяем на дубликаты
      const isDuplicate = items.some(item => 
        item.title.toLowerCase() === newItem.title.toLowerCase() && 
        item.type === newItem.type
      );

      if (isDuplicate) {
        const message = `${newItem.type === 'movie' ? 'Фильм' : 'Сериал'} "${newItem.title}" уже есть в вашем списке`;
        setError(message);
        return false; // Возвращаем false, чтобы показать, что добавление не удалось
      }

      const { data, error: supabaseError } = await supabase
        .from('watchlist')
        .insert([{
          title: newItem.title,
          type: newItem.type,
          status: newItem.status,
          year: newItem.year,
          countries: newItem.countries,
          genres: newItem.genres,
          poster: newItem.poster,
          created_at: new Date().toISOString()
        }])
        .select();

      if (supabaseError) throw supabaseError;

      if (data) {
        setItems(prevItems => [data[0], ...prevItems]);
        setError(null);
        navigate(newItem.type === 'movie' ? '/movies' : '/series');
        return true; // Возвращаем true, чтобы показать успешное добавление
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Произошла ошибка при добавлении. Попробуйте позже.');
      return false;
    }
  };

  console.log('Before render:', { items, error, isLoading });

  if (!supabase) {
    console.error('Supabase client not initialized');
    return <div>Error: Database connection not initialized</div>;
  }

  return (
    <div className="app-container">
      <Navigation canEdit={canEdit} />
      {isLoading ? (
        <div className="loading">Загрузка...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<HomePage items={items} />}
          />
          <Route
            path="/add"
            element={
              <AddForm 
                onAddItem={handleAddItem}
                error={error}
                onErrorClear={() => setError(null)}
              />
            }
          />
          <Route
            path="/movies"
            element={
              <MovieSeriesList
                items={items.filter((item) => item.type === "movie")}
                onChangeStatus={handleChangeStatus}
                canEdit={canEdit}
              />
            }
          />
          <Route
            path="/series"
            element={
              <MovieSeriesList
                items={items.filter((item) => item.type === "series")}
                onChangeStatus={handleChangeStatus}
                canEdit={canEdit}
              />
            }
          />
          <Route
            path="/evening"
            element={<MovieForEvening />}
          />
          <Route
            path="*"
            element={
              <div style={{ padding: "1rem" }}>
                <h2>Страница не найдена</h2>
              </div>
            }
          />
        </Routes>
      )}
    </div>
  );
}