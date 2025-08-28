import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="analytics-page">
      <h2>Analytics</h2>
      <div className="analytics-stats">
        <div className="stat-item">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div className="stat-item">
          <h3>Appointments Today</h3>
          <p>{stats.appointmentsToday}</p>
        </div>
        <div className="stat-item">
          <h3>Total Forms</h3>
          <p>{stats.totalForms}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
