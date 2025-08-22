import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, user }) => {
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
          { path: '/admin/students', icon: 'fas fa-users', label: 'Students' },
          { path: '/admin/counselors', icon: 'fas fa-user-md', label: 'Counselors' },
          { path: '/admin/appointments', icon: 'fas fa-calendar', label: 'Appointments' },
          { path: '/admin/forms', icon: 'fas fa-file-alt', label: 'Forms' },
          { path: '/admin/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
          { path: '/admin/announcements', icon: 'fas fa-bullhorn', label: 'Announcements' }
        ];
      case 'counselor':
        return [
          { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
          { path: '/counselor/appointments', icon: 'fas fa-calendar', label: 'My Appointments' },
          { path: '/counselor/students', icon: 'fas fa-users', label: 'My Students' },
          { path: '/counselor/forms', icon: 'fas fa-file-alt', label: 'Forms' },
          { path: '/counselor/chat', icon: 'fas fa-comments', label: 'Messages' },
          { path: '/counselor/reports', icon: 'fas fa-chart-line', label: 'Reports' }
        ];
      default:
        return [
          { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
          { path: '/student/forms', icon: 'fas fa-file-alt', label: 'Forms' },
          { path: '/student/appointments', icon: 'fas fa-calendar', label: 'Appointments' },
          { path: '/student/chat', icon: 'fas fa-comments', label: 'Messages' },
          { path: '/student/resources', icon: 'fas fa-book', label: 'Resources' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt={user?.name} 
            className="avatar-small"
          />
          <div>
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
