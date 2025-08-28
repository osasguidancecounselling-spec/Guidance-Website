import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './AppointmentDetailModal.css';

const AppointmentDetailModal = ({ isOpen, onClose, appointment, onUpdate, availability }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (appointment) {
      setAdminNotes(appointment.adminNotes || '');
      if (appointment.status === 'Scheduled' && appointment.scheduledDateTime) {
        setScheduledDate(moment(appointment.scheduledDateTime).format('YYYY-MM-DD'));
        setScheduledTime(moment(appointment.scheduledDateTime).format('HH:mm'));
      } else {
        // Reset for pending appointments
        setScheduledDate('');
        setScheduledTime('');
      }
    }
  }, [appointment]);

  if (!isOpen || !appointment) {
    return null;
  }

  const handleApprove = () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Please select a date and time to approve the appointment.');
      return;
    }
    const scheduledDateTime = moment(`${scheduledDate} ${scheduledTime}`).toISOString();
    onUpdate(appointment._id, { status: 'Scheduled', scheduledDateTime, adminNotes });
    onClose();
  };

  const handleAction = (status) => {
    onUpdate(appointment._id, { status, adminNotes });
    onClose();
  };

  const student = appointment.student || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        <h2>Appointment Details</h2>
        <div className="appointment-info">
          <p><strong>Student:</strong> {student.name || 'N/A'}</p>
          <p><strong>Student Number:</strong> {student.studentNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {student.email || 'N/A'}</p>
          <hr />
          <p><strong>Subject:</strong> {appointment.subject}</p>
          <p><strong>Description:</strong> {appointment.description}</p>
          <p><strong>Status:</strong> <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>{appointment.status}</span></p>
          <p><strong>Requested Date:</strong> {moment(appointment.preferredDate).format('MMMM Do YYYY')}</p>
          <p><strong>Requested Time:</strong> {appointment.preferredTime}</p>
        </div>

        <div className="admin-actions">
          <textarea
            className="admin-notes-textarea"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add admin notes here..."
          />

          {appointment.status === 'Pending' && (
            <div className="scheduling-form">
              <h4>Schedule Appointment</h4>
              <div className="form-group">
                <label htmlFor="scheduledDate">Date:</label>
                <input
                  type="date"
                  id="scheduledDate"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="scheduledTime">Time:</label>
                <input
                  type="time"
                  id="scheduledTime"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="action-buttons">
            {appointment.status === 'Pending' && (
              <>
                <button onClick={handleApprove} className="btn btn-approve">Approve & Schedule</button>
                <button onClick={() => handleAction('Cancelled')} className="btn btn-cancel">Cancel</button>
              </>
            )}
            {appointment.status === 'Scheduled' && (
              <>
                <button onClick={() => handleAction('Completed')} className="btn btn-complete">Mark as Completed</button>
                <button onClick={() => handleAction('Cancelled')} className="btn btn-cancel">Cancel</button>
              </>
            )}
            {['Completed', 'Cancelled'].includes(appointment.status) && (
              <p>This appointment is closed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;