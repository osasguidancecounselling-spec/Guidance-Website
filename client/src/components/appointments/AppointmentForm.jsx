import React, { useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import './AppointmentForm.css';

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await appointmentService.createAppointment({ subject, description, preferredDate });
      setMessage('✅ Appointment requested successfully!');
      // Clear form
      setSubject('');
      setDescription('');
      setPreferredDate('');
      // Notify parent component to refetch appointments
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to request appointment.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <h3>Request a New Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Academic Concerns, Personal Counseling"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Brief Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Briefly describe the reason for your appointment."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Date</label>
          <input
            type="date"
            id="preferredDate"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
        {message && (
          <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AppointmentForm;