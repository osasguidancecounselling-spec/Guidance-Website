import React, { useState } from 'react';
import './StudentProfilePage.css';

const StudentProfilePage = () => {
  const [student, setStudent] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    grade: '',
    section: '',
    course: '',
    year: '',
    dateOfBirth: '',
    address: '',
    
    // Parent Information
    motherName: '',
    motherOccupation: '',
    motherContact: '',
    motherSalary: '',
    fatherName: '',
    fatherOccupation: '',
    fatherContact: '',
    fatherSalary: '',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyPhone: '',
    
    // Profile
    profilePicture: null,
    interests: [],
    notes: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudent(prev => ({
        ...prev,
        profilePicture: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving student profile:', student);
    setIsEditing(false);
    alert('Student profile saved successfully!');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="student-profile-page">
      <div className="profile-header">
        <h1>Student Profile</h1>
        <p>View and manage student information</p>
      </div>

      <div className="profile-content">
        <div className="profile-picture-section">
          <div className="profile-picture">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="picture-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <small>Upload 1x1 profile picture</small>
            </div>
          )}
        </div>

        <div className="profile-details">
          <div className="details-section">
            <h2>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={student.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={student.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={student.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grade:</label>
                <select
                  name="grade"
                  value={student.grade}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>
              <div className="form-group">
                <label>Section:</label>
                <input
                  type="text"
                  name="section"
                  value={student.section}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Section A"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course:</label>
                <input
                  type="text"
                  name="course"
                  value={student.course}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Year:</label>
                <input
                  type="number"
                  name="year"
                  value={student.year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={student.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={student.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
              />
            </div>
          </div>

          <div className="details-section">
            <h2>Parent Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  name="motherName"
                  value={student.motherName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Mother's Occupation:</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={student.motherOccupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mother's Contact:</label>
                <input
                  type="tel"
                  name="motherContact"
                  value={student.motherContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Mother's Salary:</label>
                <input
                  type="number"
                  name="motherSalary"
                  value={student.motherSalary}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Monthly salary"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Father's Name:</label>
                <input
                  type="text"
                  name="fatherName"
                  value={student.fatherName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Father's Occupation:</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={student.fatherOccupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Father's Contact:</label>
                <input
                  type="tel"
                  name="fatherContact"
                  value={student.fatherContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Father's Salary:</label>
                <input
                  type="number"
                  name="fatherSalary"
                  value={student.fatherSalary}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Monthly salary"
                />
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2>Emergency Contact</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact:</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={student.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Emergency Phone:</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={student.emergencyPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={student.notes}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                placeholder="Add any additional notes about the student..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn-save" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-edit" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
