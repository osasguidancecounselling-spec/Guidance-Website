import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCounselors: 0,
    totalAppointments: 0,
    totalForms: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalStudents: 450,
      totalCounselors: 12,
      totalAppointments: 89,
      totalForms: 234
    });
  };

  const quickActions = [
    { title: 'Manage Students', icon: 'fas fa-users', path: '/admin/students' },
    { title: 'Manage Counselors', icon: 'fas fa-user-md', path: '/admin/counselors' },
    { title: 'View Analytics', icon: 'fas fa-chart-bar', path: '/admin/analytics' },
    { title: 'Send Announcements', icon: 'fas fa-bullhorn', path: '/admin/announcements' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h3>{stats.totalStudents}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-user-md"></i>
          <h3>{stats.totalCounselors}</h3>
          <p>Total Counselors</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-calendar"></i>
          <h3>{stats.totalAppointments}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-file-alt"></i>
          <h3>{stats.totalForms}</h3>
          <p>Total Forms</p>
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
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <i className="fas fa-users"></i>
            <div>
              <p>New student registered: Alex Johnson</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-user-md"></i>
            <div>
              <p>New counselor registered: Dr. Smith</p>
              <span>1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-calendar"></i>
            <div>
              <p>New appointment scheduled</p>
              <span>3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
