import React from 'react';
import './AppointmentList.css';

const AppointmentList = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return <p>You have no appointments.</p>;
  }

  return (
    <div className="appointment-list">
      <h3>Your Appointments</h3>
      <table>
        <thead>
          <tr>
            <th>Date Requested</th>
            <th>Preferred Date</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt._id}>
              <td>{new Date(apt.createdAt).toLocaleDateString()}</td>
              <td>{new Date(apt.preferredDate).toLocaleDateString()}</td>
              <td>{apt.subject}</td>
              <td>
                <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;