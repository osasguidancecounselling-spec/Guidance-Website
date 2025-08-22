import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/dashboard" className="logo">
          <img src="/logo.png" alt="Guidance Counseling" />
          <span>Guidance Portal</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="notification-bell">
          <i className="fas fa-bell"></i>
          <span className="notification-count">3</span>
        </div>

        <div className="user-profile">
          <button 
            className="profile-toggle"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img 
              src={user?.avatar || '/default-avatar.png'} 
              alt={user?.name} 
              className="avatar"
            />
            <span>{user?.name}</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
