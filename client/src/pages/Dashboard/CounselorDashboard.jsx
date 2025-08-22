import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CounselorDashboard.css';

const CounselorDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAppointments: 0,
    pendingForms: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalStudents: 45,
      todayAppointments: 8,
      pendingForms: 12,
      unreadMessages: 3
    });
  };

  const quickActions = [
    { title: 'View Appointments', icon: 'fas fa-calendar', path: '/counselor/appointments' },
    { title: 'Manage Students', icon: 'fas fa-users', path: '/counselor/students' },
    { title: 'Review Forms', icon: 'fas fa-file-alt', path: '/counselor/forms' },
    { title: 'Send Messages', icon: 'fas fa-comments', path: '/counselor/chat' }
  ];

  return (
    <div className="counselor-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h3>{stats.totalStudents}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-calendar-day"></i>
          <h3>{stats.todayAppointments}</h3>
          <p>Today's Appointments</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-file-alt"></i>
          <h3>{stats.pendingForms}</h3>
          <p>Pending Forms</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-envelope"></i>
          <h3>{stats.unreadMessages}</h3>
          <p>Unread Messages</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className="action-card">
              <i className={action.icon}></i>
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Today's Schedule</h2>
        <div className="schedule-list">
          <div className="schedule-item">
            <i className="fas fa-clock"></i>
            <div>
              <p>9:00 AM - Session with John Doe</p>
              <span>Room 101</span>
            </div>
          </div>
          <div className="schedule-item">
            <i className="fas fa-clock"></i>
            <div>
              <p>10:30 AM - Session with Jane Smith</p>
              <span>Room 102</span>
            </div>
          </div>
          <div className="schedule-item">
            <i className="fas fa-clock"></i>
            <div>
              <p>2:00 PM - Group Session</p>
              <span>Conference Room</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;
