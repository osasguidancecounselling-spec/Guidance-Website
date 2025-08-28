import React, { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../../services/settingsService';
import { toast } from 'react-toastify';
import './AdminSettingsPage.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminSettingsPage = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAvailability();
      const fullAvailability = daysOfWeek.map((day) => {
        const existing = data.find(d => d.dayOfWeek === day);
        return existing || { dayOfWeek: day, isAvailable: false, startTime: '09:00', endTime: '17:00' };
      });
      setAvailability(fullAvailability);
    } catch (err) {
      toast.error('Failed to load availability settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateAvailability(availability);
      toast.success('Availability updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="admin-settings-page">
      <h2>Counselor Availability</h2>
      <p>Set the days and times when counselors are available for appointments.</p>
      <form className="availability-form" onSubmit={handleSubmit}>
        {availability.map((day, index) => (
          <div key={day.dayOfWeek} className="availability-day-row">
            <span className="day-name">{day.dayOfWeek}</span>
            <div className="day-controls">
              <input
                type="checkbox"
                id={`available-${day.dayOfWeek}`}
                checked={day.isAvailable}
                onChange={(e) => handleAvailabilityChange(index, 'isAvailable', e.target.checked)}
              />
              <label htmlFor={`available-${day.dayOfWeek}`}>Available</label>
            </div>
            <div className="time-inputs">
              <input
                type="time"
                value={day.startTime}
                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                disabled={!day.isAvailable}
              />
              <span>to</span>
              <input
                type="time"
                value={day.endTime}
                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                disabled={!day.isAvailable}
              />
            </div>
          </div>
        ))}
        <button type="submit" className="btn-save-settings" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;