import React, { useState, useEffect, useCallback } from 'react';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import AppointmentList from '../../components/appointments/AppointmentList';
import { appointmentService } from '../../services/appointmentService';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getMyApointments();
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="appointments-page">
      <h2>Your Appointments</h2>
      <div className="appointments-content">
        <div className="appointment-form-section">
          <AppointmentForm onAppointmentCreated={fetchAppointments} />
        </div>
        <div className="appointment-list-section">
          {loading && <p>Loading your appointments...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && <AppointmentList appointments={appointments} />}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;