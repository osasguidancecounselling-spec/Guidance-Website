import React, { useState, useEffect, useContext } from 'react';
import { formService } from '../../services/formService';
import { AuthContext } from '../../contexts/AuthContext';

const StudentMySubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) {
        setError('You must be logged in to view submissions.');
        setLoading(false);
        return;
      }

      try {
        const data = await formService.getMySubmissions();
        // Filter submissions by current user if needed
        const userSubmissions = data.filter(sub => sub.studentId === user.id);
        setSubmissions(userSubmissions);
      } catch (err) {
        setError('Failed to load submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseDetails = () => {
    setSelectedSubmission(null);
  };

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.formName}</td>
                  <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                  <td>{submission.status}</td>
                  <td>
                    <button onClick={() => handleViewSubmission(submission)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedSubmission && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Submission Details</h3>
              <p><strong>Form:</strong> {selectedSubmission.formName}</p>
              <p><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedSubmission.status}</p>
              <button onClick={handleCloseDetails}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentMySubmissionsPage;
