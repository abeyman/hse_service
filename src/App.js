import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SlotBooking from './components/SlotBooking';
import MyBookings from './components/MyBookings';

function App() {
  const [activeTab, setActiveTab] = useState('booking');
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    };

    if (userData.name.trim() && userData.email.trim() && userData.password.trim()) {
      setCurrentUser(userData);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <Header />
        <div className="main-content">
          <div className="login-container">
            <h2>Вход в систему</h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="name">ФИО:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Введите ваше полное имя"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Введите ваш email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <div className="user-info">
          <span>Добро пожаловать, {currentUser?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            Записаться на пропуск
          </button>
          <button 
            className={`tab-button ${activeTab === 'my-bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bookings')}
          >
            Мои записи
          </button>
        </div>
        
        {activeTab === 'booking' && <SlotBooking bookings={bookings} setBookings={setBookings} currentUser={currentUser} />}
        {activeTab === 'my-bookings' && <MyBookings bookings={bookings} setBookings={setBookings} currentUser={currentUser} />}
      </div>
    </div>
  );
}

export default App;
