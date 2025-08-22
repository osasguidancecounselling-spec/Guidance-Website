import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api'; // Assuming central axios instance
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    pendingForms: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
    completedForms: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/dashboard/student');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // Optionally, set an error state here to show a message to the user
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const quickActions = [
    { title: 'Fill New Form', icon: 'fas fa-file-alt', path: '/student/forms' },
    { title: 'Book Appointment', icon: 'fas fa-calendar-plus', path: '/student/appointments' },
    { title: 'View Resources', icon: 'fas fa-book', path: '/student/resources' },
    { title: 'Contact Counselor', icon: 'fas fa-comments', path: '/student/chat' }
  ];

  if (loading) {
    return <div className="student-dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="student-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-file-alt"></i>
          <h3>{stats.pendingForms}</h3>
          <p>Pending Forms</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-calendar"></i>
          <h3>{stats.upcomingAppointments}</h3>
          <p>Upcoming Appointments</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-envelope"></i>
          <h3>{stats.unreadMessages}</h3>
          <p>Unread Messages</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-check-circle"></i>
          <h3>{stats.completedForms}</h3>
          <p>Completed Forms</p>
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
            <i className="fas fa-file-alt"></i>
            <div>
              <p>Form submitted: Mental Health Assessment</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-calendar-check"></i>
            <div>
              <p>Appointment scheduled with Dr. Smith</p>
              <span>1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-comment"></i>
            <div>
              <p>New message from counselor</p>
              <span>2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
