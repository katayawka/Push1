// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ⚠️ ОБЯЗАТЕЛЬНО замени на URL твоего бэкенда после развёртывания на Render
const API_URL = 'https://https://push-1-jeoo.onrender.com';

function App() {
  const [roomId, setRoomId] = useState('');
  const [room, setRoom] = useState(null);
  const [screen, setScreen] = useState('connect');

  const loadRoom = async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`${API_URL}/room/${roomId}`);
      setRoom(res.data);
      if (res.data.gameStarted) setScreen('game');
    } catch (err) {
      alert('Комната не найдена');
    }
  };

  const resetGame = async () => {
    try {
      await axios.post(`${API_URL}/reset`, { roomId });
      loadRoom();
    } catch (err) {
      alert('Ошибка сброса');
    }
  };

  useEffect(() => {
    if (roomId) {
      const interval = setInterval(loadRoom, 1000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  if (!roomId) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Team Button Game</h1>
        <form onSubmit={(e) => { e.preventDefault(); loadRoom(); }}>
          <input
            type="text"
            placeholder="ID комнаты"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.trim())}
            style={{ padding: '8px', fontSize: '16px', width: '200px' }}
          />
          <button type="submit" style={{ marginLeft: '10px', padding: '8px 16px' }}>
            Подключиться
          </button>
        </form>
      </div>
    );
  }

  if (screen === 'connect') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Ожидание команд</h2>
        <p>Комната: {roomId}</p>
        {room?.teams?.length > 0 ? (
          <ul>
            {room.teams.map((t, i) => (
              <li key={i}>{t.name}</li>
            ))}
          </ul>
        ) : (
          <p>Нет подключённых команд</p>
        )}
        <button onClick={() => setRoomId('')} style={{ marginTop: '1rem' }}>
          Назад
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Игра началась!</h2>
      <button onClick={resetGame} style={{ marginBottom: '1.5rem' }}>
        🔄 Обновить
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {room?.teams?.map((team) => (
          <div key={team.name}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: room.pressedTeam === team.name ? 'green' : 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {team.name}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setRoomId('')} style={{ marginTop: '1.5rem' }}>
        Назад
      </button>
    </div>
  );
}

export default App;
