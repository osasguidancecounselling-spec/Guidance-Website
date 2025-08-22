import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formService } from '../../services/formService';
import './AdminFormSubmissionsPage.css';

const AdminFormSubmissionsPage = () => {
  const { formId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await formService.getSubmissionsForForm(formId);
        setSubmissions(data);
      } catch (err) {
  console.error("Error fetching submissions:", err);
  setError(err.message || 'Failed to load submissions.');
     }finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [formId]);

  return (
    <div className="submissions-page">
      <Link to="/admin/forms" className="back-link">
        <i className="fas fa-arrow-left"></i> Back to All Forms
      </Link>
      <h2>Form Submissions</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && submissions.length === 0 && (
        <p>No submissions for this form yet.</p>
      )}

      <div className="submissions-list">
        {submissions.map((sub) => (
          <div key={sub._id} className="submission-card">
            <p><strong>Submitted by:</strong> {sub.studentName || 'Unknown'}</p>
            <p><strong>Student Number:</strong> {sub.studentNumber || 'N/A'}</p>
            <p><strong>Date:</strong> {new Date(sub.createdAt).toLocaleString()}</p>
            <Link 
              to={`/admin/forms/${formId}/submissions/${sub._id}`} 
              className="view-link"
            >
              View Submission
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFormSubmissionsPage;
