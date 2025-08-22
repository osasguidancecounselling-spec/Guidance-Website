// client/src/pages/Admin/AdminTopbar.jsx

import React, { useState } from 'react';

function AdminTopbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="admin-topbar">
      <div className="topbar-title">Guidance Counseling Admin Portal</div>
      <div className="topbar-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img src="/profile.png" alt="Admin" className="profile-img" />
        <span>Admin Name ▼</span>
        {dropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-item">Account Settings</div>
            <div className="dropdown-item">Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTopbar;
