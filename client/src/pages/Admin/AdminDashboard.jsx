// client/src/pages/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    appointmentsToday: 0,
    totalForms: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Could not load dashboard stats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Here's a quick overview of the system.</p>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="admin-stats">
        <div className="stat-card students">
          <h3><i className="fas fa-users"></i> Total Students</h3>
          <p>{loading ? '...' : stats.totalStudents}</p>
        </div>
        <div className="stat-card appointments">
          <h3><i className="fas fa-calendar-day"></i> Appointments Today</h3>
          <p>{loading ? '...' : stats.appointmentsToday}</p>
        </div>
        <div className="stat-card forms">
          <h3><i className="fas fa-file-alt"></i> Total Forms</h3>
          <p>{loading ? '...' : stats.totalForms}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
