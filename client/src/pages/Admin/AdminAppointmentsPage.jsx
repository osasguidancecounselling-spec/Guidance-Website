import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { appointmentService } from '../../services/appointmentService';
import { settingsService } from '../../services/settingsService';
import { useChat } from '../../contexts/ChatProvider';
import AppointmentCalendar from '../../components/appointments/Calendar';
import AppointmentDetailModal from '../../components/admin/appointments/AppointmentDetailModal';

import 'react-toastify/dist/ReactToastify.css';
import './AdminAppointmentsPage.css';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { socket } = useChat();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch appointments and availability in parallel
      const [appointmentsData, availabilityData] = await Promise.all([
        appointmentService.getAllAppointments(),
        settingsService.getAvailability()
      ]);
      setAppointments(appointmentsData);
      setAvailability(availabilityData);
    } catch (err) {
      setError('Failed to fetch page data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (!socket) return;

    const handleNewAppointment = (newAppointment) => {
      setAppointments(prev => [newAppointment, ...prev]);
    };

    const handleAppointmentUpdate = (updatedAppointment) => {
      setAppointments(prev =>
        prev.map(apt => (apt._id === updatedAppointment._id ? updatedAppointment : apt))
      );
      // If the updated appointment was the one selected, update the view for the modal (in Part 2)
      setSelectedAppointment(prev => prev?._id === updatedAppointment._id ? updatedAppointment : prev);
    };

    socket.on('newAppointment', handleNewAppointment);
    socket.on('appointmentUpdated', handleAppointmentUpdate);

    return () => {
      socket.off('newAppointment', handleNewAppointment);
      socket.off('appointmentUpdated', handleAppointmentUpdate);
    };
  }, [socket]);

  const handleUpdateAppointment = async (id, updateData) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointment(id, updateData);
      // The socket event will handle the state update, but we show a success toast immediately.
      toast.success(`Appointment for ${updatedAppointment.student.name} updated successfully!`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update appointment.';
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const { calendarEvents, pendingAppointments } = useMemo(() => {
    const scheduled = [];
    const pending = [];

    appointments.forEach(app => {
      if (app.status === 'Scheduled' && app.scheduledDateTime) {
        scheduled.push({
          id: app._id,
          title: `${app.subject} - ${app.student?.name || 'Unknown'}`,
          start: new Date(app.scheduledDateTime),
          end: moment(app.scheduledDateTime).add(1, 'hour').toDate(), // Assumes 1-hour slots
          resource: app, // Keep original appointment data
        });
      } else if (app.status === 'Pending') {
        pending.push(app);
      }
    });

    pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return { calendarEvents: scheduled, pendingAppointments: pending };
  }, [appointments]);

  const handleEventClick = (event) => {
    // This will open the modal in Part 2
    setSelectedAppointment(event.resource);
  };

  const handlePendingClick = (appointment) => {
    // This will open the modal in Part 2
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  if (loading) return <div className="admin-appointments-page"><p>Loading appointments...</p></div>;
  if (error) return <div className="admin-appointments-page"><p className="error-message">{error}</p></div>;

  return (
    <div className="admin-appointments-page">
      <h2>Manage Appointments</h2>
      <div className="admin-appointments-container">
        <div className="calendar-container">
          <h3>Scheduled Appointments</h3>
          <AppointmentCalendar events={calendarEvents} onSelectEvent={handleEventClick} />
        </div>
        <div className="pending-requests-container">
          <h3>Pending Requests ({pendingAppointments.length})</h3>
          <div className="pending-requests-list">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map(app => (
                <div key={app._id} className="pending-request-card" onClick={() => handlePendingClick(app)}>
                  <p className="subject">{app.subject}</p>
                  <p className="student"><strong>Student:</strong> {app.student?.name || 'N/A'}</p>
                  <p className="date"><strong>Requested:</strong> {moment(app.requestedDate).format('MMM D, YYYY')}</p>
                </div>
              ))
            ) : (<p className="no-pending">No pending requests.</p>)}
          </div>
        </div>
      </div>
      <AppointmentDetailModal
        isOpen={!!selectedAppointment}
        onClose={closeModal}
        appointment={selectedAppointment}
        onUpdate={handleUpdateAppointment}
        availability={availability}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdminAppointmentsPage;