import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import StudentForm from './StudentForm';
import StudentProfile from './StudentProfile';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    course: '',
    year: '',
    section: ''
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    courses: [],
    years: [],
    sections: []
  });

  useEffect(() => {
    fetchStudents();
    fetchFilterOptions();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents(filters);
      setStudents(data.students);
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        total: data.total
      });
    } catch (err) {
      setError('Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const options = await studentService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentService.deleteStudent(id);
      fetchStudents(); // Refresh the list
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onClose={handleCloseProfile} />;
  }

  if (showForm) {
    return (
      <StudentForm
        student={editingStudent}
        onSave={fetchStudents}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Manage Students</h2>
        <button className="btn-primary" onClick={handleCreate}>
          Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or student number..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        
        <select
          value={filters.course}
          onChange={(e) => handleFilterChange('course', e.target.value)}
          className="filter-select"
        >
          <option value="">All Courses</option>
          {filterOptions.courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="filter-select"
        >
          <option value="">All Years</option>
          {filterOptions.years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={filters.section}
          onChange={(e) => handleFilterChange('section', e.target.value)}
          className="filter-select"
        >
          <option value="">All Sections</option>
          {filterOptions.sections.map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <>
          <div className="student-list">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course || '-'}</td>
                    <td>{student.year || '-'}</td>
                    <td>{student.section || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => handleView(student)}
                          title="View Profile"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(student)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(student._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 && (
              <div className="no-students">
                No students found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>
              
              <span>
                Page {filters.page} of {pagination.totalPages}
              </span>
              
              <button
                disabled={filters.page === pagination.totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;
