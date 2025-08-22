// client/src/pages/Admin/AdminSidebar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        <span>Guidance</span>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          ☰
        </button>
      </div>

      <ul className="sidebar-menu">
        <li><NavLink to="/admin/dashboard"><i className="fas fa-tachometer-alt"></i><span>Dashboard</span></NavLink></li>
        <li><NavLink to="/admin/analytics"><i className="fas fa-chart-line"></i><span>Analytics</span></NavLink></li>
        <li><NavLink to="/admin/appointments"><i className="fas fa-calendar-check"></i><span>Appointments</span></NavLink></li>
        <li><NavLink to="/admin/students"><i className="fas fa-users"></i><span>Students</span></NavLink></li>
        <li><NavLink to="/admin/chat"><i className="fas fa-comments"></i><span>Chat</span></NavLink></li>
        <li><NavLink to="/admin/forms"><i className="fas fa-file-alt"></i><span>Forms</span></NavLink></li>
        <li><NavLink to="/admin/resources"><i className="fas fa-book"></i><span>Resources</span></NavLink></li>
        <li><NavLink to="/admin/settings"><i className="fas fa-cog"></i><span>Settings</span></NavLink></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
