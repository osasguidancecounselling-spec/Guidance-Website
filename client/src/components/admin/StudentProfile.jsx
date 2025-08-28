import React from 'react';
import './StudentProfile.css';

const StudentProfile = ({ student, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="student-profile-overlay">
      <div className="student-profile-container">
        <div className="student-profile-header">
          <h2>Student Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="student-profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>Student Number:</label>
                <span>{student.studentNumber}</span>
              </div>
              <div className="profile-item">
                <label>Full Name:</label>
                <span>{student.name}</span>
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <span>{student.email}</span>
              </div>
              <div className="profile-item">
                <label>Course:</label>
                <span>{student.course || 'Not specified'}</span>
              </div>
              <div className="profile-item">
                <label>Year:</label>
                <span>{student.year || 'Not specified'}</span>
              </div>
              <div className="profile-item">
                <label>Section:</label>
                <span>{student.section || 'Not specified'}</span>
              </div>
              <div className="profile-item">
                <label>Date Created:</label>
                <span>{formatDate(student.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Placeholder for future sections */}
          <div className="profile-section">
            <h3>Academic Records</h3>
            <p className="placeholder-text">
              Academic records and performance data will be displayed here.
            </p>
          </div>

          <div className="profile-section">
            <h3>Appointment History</h3>
            <p className="placeholder-text">
              Appointment history and counseling sessions will be displayed here.
            </p>
          </div>

          <div className="profile-section">
            <h3>Form Submissions</h3>
            <p className="placeholder-text">
              Submitted forms and documents will be displayed here.
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
