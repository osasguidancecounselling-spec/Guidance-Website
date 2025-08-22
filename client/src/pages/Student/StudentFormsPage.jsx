import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formService } from '../../services/formService';
import './StudentFormsPage.css';

const StudentFormsPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formService.getAllForms();
        setForms(data);
      } catch (err) {
        setError('Failed to load forms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  return (
    <div className="student-forms-page">
      <h2>Available Forms</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="forms-grid">
        {forms.map(form => (
          <Link to={`/student/forms/view/${form._id}`} key={form._id} className="form-card">
            <i className="fas fa-file-alt form-icon"></i>
            <h3>{form.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentFormsPage;