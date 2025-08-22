import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../../services/formService';
import { useAuth } from '../../hooks/useAuth';
import './StudentFormViewerPage.css';

const StudentFormViewerPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await formService.getFormById(formId);
        setForm(data);
      } catch (err) {
        setError('Failed to load the form.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    const studentInfo = {
      studentNumber: user.studentNumber,
      surname: user.name.split(' ').pop(),
      course: user.course,
    };

    try {
      const res = await formService.submitFormAnswers(formId, answers, 'student', studentInfo);
      setMessage(`${res.message} Filename: ${res.filename}`);
      setTimeout(() => navigate('/student/forms'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="form-viewer-status">Loading form...</p>;
  if (error) return <p className="form-viewer-status error">{error}</p>;

  return (
    <div className="form-viewer-container">
      <form onSubmit={handleSubmit} className="form-viewer-card">
        <h2 className="form-title">{form.title}</h2>
        <div className="form-question-list">
          {form.questions.map(q => (
            <div key={q.id} className="form-question-item">
              <label>{q.question}</label>
              <input
                type="text"
                onChange={e => handleInputChange(q.question, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" className="form-submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
        {message && <p className="form-message success">{message}</p>}
      </form>
    </div>
  );
};

export default StudentFormViewerPage;