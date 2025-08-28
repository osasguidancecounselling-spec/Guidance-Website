import React, { useState, useEffect } from 'react';
import { formService } from '../../services/formService'; // Using the more complete service file

// The `user` object is needed to know who is submitting the form.
// The `onSuccess` callback is a good practice to notify parent components.
const FormRenderer = ({ formId, user, onSuccess }) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const formData = await formService.getFormById(formId);
        setForm(formData);
        setError('');
      } catch (err) {
        setError('Failed to load the form. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  // Use the question as the key for the response object
  const handleChange = (question, value) => {
    setResponses({ ...responses, [question]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSubmissionMessage({ type: 'error', text: 'You must be logged in to submit.' });
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      // The backend expects studentInfo for PDF generation
      const studentInfo = {
        name: user.name,
        studentNumber: user.studentNumber,
        course: user.course,
        year: user.year,
        section: user.section,
      };

      await formService.submitFormAnswers(formId, responses, user.role, studentInfo);
      setSubmissionMessage({ type: 'success', text: 'Form submitted successfully!' });
      setResponses({}); // Clear form
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setSubmissionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit form.' });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading form...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!form) return <div>Form not found.</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.title}</h2>
      {/* NOTE: The backend Form model uses `questions`, not `fields`. This has been adjusted. */}
      {/* The model also lacks a `required` property, so it's being omitted here for now. */}
      {form.questions.map((field, index) => {
        switch (field.type) {
          case 'text':
            return (
              <div key={index}>
                <label>{field.question}</label>
                <input
                  type="text"
                  onChange={(e) => handleChange(field.question, e.target.value)}
                />
              </div>
            );
          case 'textarea':
            return (
              <div key={index}>
                <label>{field.question}</label>
                <textarea
                  onChange={(e) => handleChange(field.question, e.target.value)}
                />
              </div>
            );
          case 'number':
            return (
              <div key={index}>
                <label>{field.question}</label>
                <input
                  type="number"
                  onChange={(e) => handleChange(field.question, e.target.value)}
                />
              </div>
            );
          case 'date':
            return (
              <div key={index}>
                <label>{field.question}</label>
                <input
                  type="date"
                  onChange={(e) => handleChange(field.question, e.target.value)}
                />
              </div>
            );
          case 'checkbox':
            return (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(field.question, e.target.checked)}
                  />
                  {field.question}
                </label>
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {submissionMessage && (
        <p className={`submission-message ${submissionMessage.type}`}>
          {submissionMessage.text}
        </p>
      )}
    </form>
  );
};

export default FormRenderer;
