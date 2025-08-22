import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import StudentDashboard from './StudentDashboard';
import CounselorDashboard from './CounselorDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'counselor':
        return <CounselorDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}</h1>
        <p className="dashboard-subtitle">
          {user?.role === 'admin' && 'Admin Dashboard'}
          {user?.role === 'counselor' && 'Counselor Dashboard'}
          {user?.role === 'student' && 'Student Dashboard'}
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
