import React, { useState, useEffect } from 'react';
import AppointmentCalendar from '../components/appointments/Calendar';
import { useAuth } from '../hooks/useAuth';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    // TODO: Fetch appointments based on user role
    const mockAppointments = [
      {
        id: 1,
        date: new Date(),
        time: '10:00 AM',
        duration: 60,
        status: 'scheduled',
        student: 'John Doe',
        counselor: 'Dr. Smith'
      }
    ];
    setAppointments(mockAppointments);
  };

  const handleBookAppointment = async (appointmentData) => {
    // TODO: Book appointment through API
    console.log('Booking appointment:', appointmentData);
  };

  const handleCancelAppointment = async (appointmentId) => {
    // TODO: Cancel appointment through API
    console.log('Canceling appointment:', appointmentId);
  };

  return (
    <div className="appointments-page">
      <h1>Appointments</h1>
      
      {user?.role === 'counselor' && (
        <div className="counselor-controls">
          <button>Set Availability</button>
          <button>View Schedule</button>
        </div>
      )}
      
      <AppointmentCalendar
        user={user}
        appointments={appointments}
        onBook={handleBookAppointment}
        onCancel={handleCancelAppointment}
      />
      
      <div className="appointment-list">
        <h2>Upcoming Appointments</h2>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <p>Date: {appointment.date.toLocaleDateString()}</p>
            <p>Time: {appointment.time}</p>
            <p>Duration: {appointment.duration} minutes</p>
            <p>Status: {appointment.status}</p>
            <button onClick={() => handleCancelAppointment(appointment.id)}>
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
