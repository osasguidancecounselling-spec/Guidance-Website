import React from 'react';

const Topbar = () => {
  return (
    <div className="h-16 bg-white shadow-md pl-64 flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">Guidance Counseling Web App</h1>
      <div className="flex items-center gap-4">
        {/* Profile and logout button placeholders */}
        <span>Welcome, Student</span>
        <button className="bg-green-600 text-white px-4 py-1 rounded">Logout</button>
      </div>
    </div>
  );
};

export default Topbar;
