import React, { useState, useEffect } from 'react';
import './SlotBooking.css';

const SlotBooking = ({ bookings, setBookings, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    photo: null
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  // Функция для генерации слотов по 10 минут
  const generateSlots = () => {
    const slots = [];
    const startHour = 9; // 9:00
    const endHour = 17; // 17:00
    const breakStartHour = 13; // 13:00
    const breakEndHour = 14; // 14:00
    
    let slotId = 1;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Пропускаем перерыв с 13:00 до 14:00
      if (hour >= breakStartHour && hour < breakEndHour) {
        continue;
      }
      
      for (let minute = 0; minute < 60; minute += 10) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Случайно делаем некоторые слоты занятыми (примерно 30% занятых)
        const isAvailable = Math.random() > 0.3;
        
        slots.push({
          id: slotId++,
          time: timeString,
          available: isAvailable
        });
      }
    }
    
    return slots;
  };

  const mockSlots = generateSlots();

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(mockSlots);
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentInfo(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !studentInfo.name) {
      alert('Пожалуйста, выберите слот');
      return;
    }

    // Проверяем, есть ли уже запись у этого пользователя
    const existingBooking = bookings.find(booking => 
      booking.email === studentInfo.email
    );

    if (existingBooking) {
      alert('У вас уже есть активная запись. Сначала отмените существующую запись, чтобы создать новую.');
      return;
    }

    setIsBooking(true);
    
    // Имитация отправки данных
    setTimeout(() => {
      const newBooking = {
        id: Date.now(), // Простой ID на основе времени
        date: selectedDate,
        time: selectedSlot.time,
        studentName: studentInfo.name,
        email: studentInfo.email,
        photo: studentInfo.photo
      };
      
      setBookings([...bookings, newBooking]);
      alert('Запись успешно создана!');
      setIsBooking(false);
      setStudentInfo({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        photo: null
      });
      setSelectedSlot(null);
    }, 1000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="slot-booking">
      <div className="booking-container">
        <h2>Запись на получение пропуска</h2>
        
        <div className="booking-form">
          <div className="form-section">
            <h3>Выберите дату и время</h3>
            <div className="date-selector">
              <label htmlFor="date">Дата:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                required
              />
            </div>
            
            {selectedDate && (
              <div className="slots-grid">
                <h4>Доступные слоты:</h4>
                <p className="slots-info">
                  Слоты по 10 минут с 9:00 до 17:00 (перерыв с 13:00 до 14:00)
                </p>
                <div className="slots-container">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.id}
                      className={`slot-button ${!slot.available ? 'unavailable' : ''} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleBooking} className="student-form">
            <h3>Информация о записи</h3>
            
            <div className="form-group">
              <label htmlFor="name">ФИО</label>
              <input
                type="text"
                id="name"
                name="name"
                value={studentInfo.name}
                onChange={handleInputChange}
                required
                placeholder="Введите ваше полное имя"
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={studentInfo.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Фото для пропуска</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="file-input"
              />
              {studentInfo.photo && (
                <p className="file-selected">Выбран файл: {studentInfo.photo.name}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={!selectedSlot || isBooking}
            >
              {isBooking ? 'Записываем...' : 'Записаться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
