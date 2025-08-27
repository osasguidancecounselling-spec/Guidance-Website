import React, { useState, useEffect } from 'react';
import './MySchedulePage.css';

const MySchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample schedule data - in a real app, this would come from an API
  const sampleSchedule = [
    {
      id: 1,
      title: 'Math Tutoring',
      date: '2024-01-20',
      time: '10:00 AM - 11:00 AM',
      location: 'Room 101',
      type: 'Tutoring'
    },
    {
      id: 2,
      title: 'College Counseling',
      date: '2024-01-21',
      time: '2:00 PM - 3:00 PM',
      location: 'Counseling Office',
      type: 'Counseling'
    },
    {
      id: 3,
      title: 'Study Group',
      date: '2024-01-22',
      time: '4:00 PM - 5:00 PM',
      location: 'Library',
      type: 'Study'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch schedule
    setSchedule(sampleSchedule);
  }, []);

  const filteredSchedule = schedule.filter(item => item.date === selectedDate);

  return (
    <div className="my-schedule-page">
      <div className="schedule-header">
        <h1>My Schedule</h1>
        <p>View and manage your upcoming appointments and activities</p>
      </div>

      <div className="schedule-controls">
        <div className="date-selector">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="schedule-content">
        {filteredSchedule.length > 0 ? (
          <div className="schedule-list">
            {filteredSchedule.map(item => (
              <div key={item.id} className="schedule-item">
                <div className="item-header">
                  <span className={`item-type ${item.type.toLowerCase()}`}>
                    {item.type}
                  </span>
                  <span className="item-time">{item.time}</span>
                </div>
                <h3 className="item-title">{item.title}</h3>
                <p className="item-location">{item.location}</p>
                <div className="item-actions">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-cancel">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schedule">
            <p>No schedule items found for {selectedDate}</p>
          </div>
        )}
      </div>

      <div className="schedule-stats">
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <p className="stat-number">{schedule.length}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p className="stat-number">
            {schedule.filter(item => {
              const itemDate = new Date(item.date);
              const today = new Date();
              const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              return itemDate >= weekStart && itemDate <= weekEnd;
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MySchedulePage;
