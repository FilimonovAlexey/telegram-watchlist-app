import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import MovieSeriesList from "./components/MovieSeriesList";
import AddForm from "./components/AddForm";
import { supabase } from './lib/supabase';
import HomePage from "./components/HomePage";
import WatchHistory from "./components/WatchHistory";
import DevPage from './components/DevPage';

const ALLOWED_USER_IDS = [364609948, 222222222];

export default function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function getTelegramUserId() {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      const userId = initData?.user?.id;
      console.log('Raw User ID:', userId);
      return userId ? Number(userId) : null;
    }
    return null;
  }

  // Загрузка данных при инициализации
  useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching items:', error);
        } else {
          console.log('Fetched data:', data);
          setItems(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

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
      // Обновляем запись вместо удаления
      const { error } = await supabase
        .from('watchlist')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id 
            ? { ...item, status: newStatus, updated_at: new Date().toISOString() } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      console.log('Saving item with full data:', newItem);

      const { data, error } = await supabase
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

      if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
      }

      if (data) {
        console.log('Successfully saved data:', data);
        setItems(prevItems => [data[0], ...prevItems]);
        navigate(newItem.type === 'movie' ? '/movies' : '/series');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const canEdit = ALLOWED_USER_IDS.includes(userId);

  if (isLoading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation canEdit={canEdit} />

      <Routes>
        <Route
          path="/"
          element={<HomePage items={items} />}
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
          path="/watched/movies"
          element={
            <MovieSeriesList
              items={items.filter((item) => item.type === "movie" && item.status === "Посмотрели")}
              onChangeStatus={handleChangeStatus}
              canEdit={canEdit}
            />
          }
        />
        <Route
          path="/watched/series"
          element={
            <MovieSeriesList
              items={items.filter((item) => item.type === "series" && item.status === "Посмотрели")}
              onChangeStatus={handleChangeStatus}
              canEdit={canEdit}
            />
          }
        />
        <Route
          path="/history"
          element={<WatchHistory items={items} />}
        />
        {canEdit && (
          <Route path="/add" element={<AddForm onAddItem={handleAddItem} />} />
        )}
        <Route
          path="/dev"
          element={
            <DevPage
              items={items}
              onAddItem={handleAddItem}
              onChangeStatus={handleChangeStatus}
            />
          }
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
    </div>
  );
}