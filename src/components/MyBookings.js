import React, { useState } from 'react';
import './MyBookings.css';

const MyBookings = ({ bookings, setBookings, currentUser }) => {
  
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);

  // Получаем запись текущего пользователя
  const currentUserBooking = bookings.find(booking => 
    booking.email === currentUser?.email
  );

  // Функция для генерации слотов по 10 минут (такая же как в SlotBooking)
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

  const handleCancel = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить запись?')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Запись отменена');
    }
  };

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
    setRescheduleSlots(generateSlots());
    setShowRescheduleModal(true);
  };

  const handleTimeSlotSelect = (slot) => {
    if (slot.available) {
      setNewTime(slot.time);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      alert('Пожалуйста, выберите дату и время');
      return;
    }

    setBookings(bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { ...booking, date: newDate, time: newTime }
        : booking
    ));

    setShowRescheduleModal(false);
    setSelectedBooking(null);
    alert('Запись перенесена');
  };


  return (
    <div className="my-bookings">
      <div className="bookings-container">
        <h2>Мои записи</h2>
        
        {!currentUserBooking ? (
          <div className="no-bookings">
            <p>У вас пока нет записей</p>
          </div>
        ) : (
          <div className="bookings-list">
            <div key={currentUserBooking.id} className="booking-card">
              <div className="booking-info">
                <h3>{currentUserBooking.studentName}</h3>
                <p className="student-email">Email: {currentUserBooking.email}</p>
                <p className="booking-date">
                  {new Date(currentUserBooking.date).toLocaleDateString('ru-RU')} в {currentUserBooking.time}
                </p>
              </div>
              
              <div className="booking-actions">
                <button 
                  className="action-button reschedule"
                  onClick={() => handleReschedule(currentUserBooking)}
                >
                  Перенести
                </button>
                <button 
                  className="action-button cancel"
                  onClick={() => handleCancel(currentUserBooking.id)}
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="modal reschedule-modal">
            <h3>Перенос записи</h3>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label htmlFor="newDate">Новая дата:</label>
                <input
                  type="date"
                  id="newDate"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Новое время:</label>
                <p className="slots-info">
                  Слоты по 10 минут с 9:00 до 17:00 (перерыв с 13:00 до 14:00)
                </p>
                <div className="modal-slots-container">
                  {rescheduleSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`modal-slot-button ${!slot.available ? 'unavailable' : ''} ${newTime === slot.time ? 'selected' : ''}`}
                      onClick={() => handleTimeSlotSelect(slot)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowRescheduleModal(false)}>
                  Отмена
                </button>
                <button type="submit">Перенести</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
