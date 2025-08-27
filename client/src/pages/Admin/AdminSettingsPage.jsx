import React, { useState } from 'react';
import './AdminSettingsPage.css';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemMaintenance: false,
    theme: 'light',
    language: 'en'
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-settings-page">
      <div className="settings-header">
        <h1>Admin Settings</h1>
        <p>Manage system settings and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
              SMS Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.appointmentReminders}
                onChange={(e) => handleSettingChange('appointmentReminders', e.target.checked)}
              />
              Appointment Reminders
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>System Settings</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.systemMaintenance}
                onChange={(e) => handleSettingChange('systemMaintenance', e.target.checked)}
              />
              System Maintenance Mode
            </label>
          </div>
          <div className="setting-item">
            <label>Theme:</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Language:</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>User Management</h2>
          <div className="setting-item">
            <button className="btn-manage-users">Manage Users</button>
          </div>
          <div className="setting-item">
            <button className="btn-backup-data">Backup Data</button>
          </div>
          <div className="setting-item">
            <button className="btn-system-logs">View System Logs</button>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSaveSettings}>
            Save Settings
          </button>
          <button className="btn-reset">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
