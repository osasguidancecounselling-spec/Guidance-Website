import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    appointments: {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0
    },
    resources: {
      total: 0,
      downloads: 0,
      popular: []
    },
    students: {
      total: 0,
      active: 0,
      newThisMonth: 0
    }
  });

  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      // Mock data
      const mockData = {
        appointments: {
          total: 156,
          completed: 120,
          pending: 25,
          cancelled: 11
        },
        resources: {
          total: 45,
          downloads: 892,
          popular: [
            { name: 'College Guide', downloads: 245 },
            { name: 'Resume Template', downloads: 189 },
            { name: 'Scholarship List', downloads: 156 }
          ]
        },
        students: {
          total: 324,
          active: 278,
          newThisMonth: 23
        }
      };
      setAnalyticsData(mockData);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const appointmentCompletionRate = analyticsData.appointments.total > 0 
    ? ((analyticsData.appointments.completed / analyticsData.appointments.total) * 100).toFixed(1)
    : 0;

  const averageDownloadsPerResource = analyticsData.resources.total > 0 
    ? (analyticsData.resources.downloads / analyticsData.resources.total).toFixed(1)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Appointments Stats */}
        <div className="stat-card">
          <h3>Appointments</h3>
          <div className="stat-numbers">
            <div className="stat-item">
              <span className="stat-label">Total</span>
              <span className="stat-value">{analyticsData.appointments.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{analyticsData.appointments.completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">{appointmentCompletionRate}%</span>
            </div>
          </div>
        </div>

        {/* Resources Stats */}
        <div className="stat-card">
          <h3>Resources</h3>
          <div className="stat-numbers">
            <div className="stat-item">
              <span className="stat-label">Total Resources</span>
              <span className="stat-value">{analyticsData.resources.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Downloads</span>
              <span className="stat-value">{analyticsData.resources.downloads}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg per Resource</span>
              <span className="stat-value">{averageDownloadsPerResource}</span>
            </div>
          </div>
        </div>

        {/* Students Stats */}
        <div className="stat-card">
          <h3>Students</h3>
          <div className="stat-numbers">
            <div className="stat-item">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{analyticsData.students.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Students</span>
              <span className="stat-value">{analyticsData.students.active}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">New This Month</span>
              <span className="stat-value">{analyticsData.students.newThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="stat-card popular-resources">
          <h3>Popular Resources</h3>
          <div className="resource-list">
            {analyticsData.resources.popular.map((resource, index) => (
              <div key={index} className="resource-item">
                <span className="resource-name">{resource.name}</span>
                <span className="resource-downloads">{resource.downloads} downloads</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
