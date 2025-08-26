import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { formService } from '../../services/formService';
import { toast } from 'react-toastify';
import './SubmissionViewer.css';

const SubmissionViewer = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const data = await formService.getSubmissionById(submissionId);
        setSubmission(data);
      } catch (err) {
        toast.error('Failed to load submission details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  if (loading) {
    return <div className="submission-viewer-page"><p>Loading submission...</p></div>;
  }

  if (!submission) {
    return (
      <div className="submission-viewer-page">
        <h2>Submission Not Found</h2>
        <p>The requested submission could not be found.</p>
        <Link to="/admin/forms" className="back-link">Back to All Submissions</Link>
      </div>
    );
  }

  return (
    <div className="submission-viewer-page">
      <div className="viewer-header">
        <div>
          <h2>{submission.form.title}</h2>
          <p className="sub-header">Submitted by {submission.student.name}</p>
        </div>
        <a href={submission.pdfUrl} className="download-pdf-btn" target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      </div>

      <div className="student-details-card">
        <h3>Student Information</h3>
        <div className="details-grid">
          <p><strong>Name:</strong> {submission.student.name}</p>
          <p><strong>Email:</strong> {submission.student.email}</p>
          <p><strong>Course:</strong> {submission.student.course}</p>
          <p><strong>Year & Section:</strong> {`${submission.student.year} - ${submission.student.section}`}</p>
          <p><strong>Submitted On:</strong> {moment(submission.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
        </div>
      </div>

      <div className="answers-card">
        <h3>Form Responses</h3>
        <p>The student's complete answers are available in the generated PDF document.</p>
        <p>Click the "Download PDF" button above to view the full submission.</p>
      </div>

      <Link to="/admin/forms" className="back-link">← Back to All Submissions</Link>
    </div>
  );
};

export default SubmissionViewer;