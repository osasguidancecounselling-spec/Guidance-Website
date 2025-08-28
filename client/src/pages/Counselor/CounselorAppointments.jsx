import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import './CounselorAppointments.css';

const CounselorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="counselor-appointments">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>{appointment.date} - {appointment.time}</p>
              <p>With: {appointment.studentName}</p>
              <p>Status: {appointment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CounselorAppointments;
