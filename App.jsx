import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ⚠️ ЗАМЕНИ ЭТОТ URL НА СВОЙ ПОСЛЕ РАЗВЁРТЫВАНИЯ БЭКЕНДА НА RENDER!
const API_URL = 'https://push-1-jeoo.onrender.com';

function App() {
  const [roomId, setRoomId] = useState('');
  const [room, setRoom] = useState(null);
  const [screen, setScreen] = useState('connect'); // 'connect' или 'game'

  const loadRoom = async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`${API_URL}/room/${roomId}`);
      setRoom(res.data);
      if (res.data.gameStarted) {
        setScreen('game');
      }
    } catch (err) {
      alert('Комната не найдена или сервер недоступен');
    }
  };

  const resetGame = async () => {
    try {
      await axios.post(`${API_URL}/reset`, { roomId });
      loadRoom();
    } catch (err) {
      alert('Не удалось сбросить игру');
    }
  };

  useEffect(() => {
    if (roomId) {
      const interval = setInterval(loadRoom, 1000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadRoom();
  };

  if (!roomId) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Team Button Game</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Введите ID комнаты:
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.trim())}
              placeholder="Например: 123"
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '8px' }}
            />
          </label>
          <button
            type="submit"
            disabled={!roomId}
            style={{ marginTop: '16px', padding: '10px 20px', fontSize: '16px' }}
          >
            Подключиться
          </button>
        </form>
      </div>
    );
  }

  if (screen === 'connect') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>Ожидание подключения команд</h2>
        <p><strong>Комната:</strong> {roomId}</p>
        {room?.teams && room.teams.length > 0 ? (
          <>
            <h3>Подключённые команды:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {room.teams.map((team, i) => (
                <li key={i} style={{ fontSize: '18px', margin: '8px 0' }}>{team.name}</li>
              ))}
            </ul>
            {!room.gameStarted && <p>Ожидаем запуска игры...</p>}
          </>
        ) : (
          <p>Пока нет подключённых команд</p>
        )}
        <button
          onClick={() => setRoomId('')}
          style={{ marginTop: '20px', padding: '8px 16px' }}
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Игра началась!</h2>
      <p><strong>Комната:</strong> {roomId}</p>
      <button
        onClick={resetGame}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Обновить (сбросить все нажатия)
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {room?.teams.map((team) => (
          <div key={team.name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: room.pressedTeam === team.name ? 'green' : 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                margin: '0 auto'
              }}
            >
              {team.name}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRoomId('')}
        style={{ marginTop: '20px', padding: '8px 16px' }}
      >
        Назад
      </button>
    </div>
  );
}

export default App;