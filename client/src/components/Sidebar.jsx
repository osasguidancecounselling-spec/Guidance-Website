import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-green-700 text-white fixed">
      <h2 className="text-xl font-bold p-4 border-b border-green-500">Dashboard</h2>
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink to="/home" className="hover:bg-green-600 p-2 rounded">Home</NavLink>
        <NavLink to="/chat" className="hover:bg-green-600 p-2 rounded">Chat</NavLink>
        <NavLink to="/forms" className="hover:bg-green-600 p-2 rounded">Forms</NavLink>
        <NavLink to="/announcements" className="hover:bg-green-600 p-2 rounded">Announcements</NavLink>
        <NavLink to="/appointments" className="hover:bg-green-600 p-2 rounded">Appointments</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
