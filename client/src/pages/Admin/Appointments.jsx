import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { chatService } from '../../services/chatService';
import AdminAppointmentList from '../../components/appointments/AdminAppointmentList';
import ChatInterface from '../../components/chat/ChatInterface';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleUpdateAppointment = async (appointmentId, updates) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointment(appointmentId, updates);
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? updatedAppointment : appt
      ));
    } catch (err) {
      setError('Failed to update appointment.');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      setAppointments(appointments.filter(appt => appt._id !== appointmentId));
      if (selectedAppointment && selectedAppointment._id === appointmentId) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      setError('Failed to delete appointment.');
    }
  };

  const handleSendMessage = async (message) => {
    try {
      if (selectedAppointment) {
        await chatService.sendMessage({
          text: message,
          appointmentId: selectedAppointment._id,
        });
      }
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Appointments Management</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <AdminAppointmentList 
            appointments={appointments}
            onSelectAppointment={handleSelectAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </div>
        <div style={{ flex: 1 }}>
          {selectedAppointment ? (
            <div>
              <h3>Chat for {selectedAppointment.studentName}</h3>
              <ChatInterface onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <p>Select an appointment to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
