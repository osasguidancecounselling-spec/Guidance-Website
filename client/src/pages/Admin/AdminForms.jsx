import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formService } from '../../services/formService';
import { toast, ToastContainer } from 'react-toastify';
import './AdminForms.css';

const AdminForms = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ course: '', year: '', section: '' });
  const [filterOptions, setFilterOptions] = useState({ courses: [], years: [], sections: [] });
  const [showUploader, setShowUploader] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // State for the uploader
  const [formFile, setFormFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fetchSubmissions = useCallback(async () => {
    // This function is now for fetching submissions
    try {
      setLoading(true);
      const data = await formService.getAllSubmissions(filters);
      setSubmissions(data);
    } catch (err) {
      toast.error('Failed to fetch form submissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await formService.getFilterOptions();
        setFilterOptions({ courses: options.courses, years: options.years, sections: options.sections });
      } catch (err) {
        toast.error('Failed to load filter options.');
        console.error(err);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formFile) {
      toast.warn('Please select a file to upload.');
      return;
    }
    setUploading(true);
    try {
      const res = await formService.uploadForm(formFile);
      toast.success(res.message || 'Form template uploaded successfully!');
      setFormFile(null);
      e.target.reset();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload form.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectOne = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubmissions(submissions.map(s => s._id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleBatchDownload = async () => {
    if (selectedSubmissions.length === 0) return;

    setIsDownloading(true);
    try {
      const blob = await formService.batchDownloadSubmissions(selectedSubmissions);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      const course = filters.course ? `_${filters.course.replace(/\s+/g, '-')}` : '';
      const year = filters.year ? `_${filters.year.replace(/\s+/g, '-')}` : '';
      link.setAttribute('download', `submissions${course}${year}_${moment().format('YYYY-MM-DD')}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSelectedSubmissions([]); // Clear selection after download
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to download batch. Please try again.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const noFiltersApplied = !filters.course && !filters.year && !filters.section;

  return (
    <div className="admin-forms-page">
      <h2>Form Submissions</h2>
      <div className="form-actions-header">
        {selectedSubmissions.length > 0 && (
          <button 
            className="batch-download-btn" 
            onClick={handleBatchDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : `Download Selected (${selectedSubmissions.length})`}
          </button>
        )}
        <button className="toggle-uploader-btn" onClick={() => setShowUploader(!showUploader)}>
          {showUploader ? 'Hide Uploader' : 'Upload New Form Template'}
        </button>
      </div>

      {showUploader && (
        <div className="form-upload-section">
          <h3>Upload New Form Template</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <input type="file" accept=".docx" onChange={handleFileChange} required />
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Template'}
            </button>
          </form>
        </div>
      )}

      <div className="submissions-container">
        <div className="submissions-filters">
          <select name="course" value={filters.course} onChange={handleFilterChange}>
            <option value="">All Courses</option>
            {filterOptions.courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select name="section" value={filters.section} onChange={handleFilterChange}>
            <option value="">All Sections</option>
            {filterOptions.sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="clear-filters-btn" onClick={() => setFilters({ course: '', year: '', section: '' })} disabled={noFiltersApplied}>
            Clear Filters
          </button>
        </div>

        <div className="submissions-table-container">
          {loading ? <p>Loading submissions...</p> : (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={submissions.length > 0 && selectedSubmissions.length === submissions.length}
                      disabled={submissions.length === 0}
                    />
                  </th>
                  <th>Student Name</th>
                  <th>Form Title</th>
                  <th>Course</th>
                  <th>Year & Section</th>
                  <th>Submitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? submissions.map(sub => (
                  <tr key={sub._id} className={selectedSubmissions.includes(sub._id) ? 'selected' : ''}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedSubmissions.includes(sub._id)}
                        onChange={() => handleSelectOne(sub._id)}
                      />
                    </td>
                    <td>{sub.student?.name || 'N/A'}</td>
                    <td>{sub.form?.title || 'N/A'}</td>
                    <td>{sub.student?.course || 'N/A'}</td>
                    <td>{`${sub.student?.year || 'N/A'} - ${sub.student?.section || 'N/A'}`}</td>
                    <td>{moment(sub.createdAt).format('MM, DD, YYYY')}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/submissions/view/${sub._id}`} className="action-btn details">View Details</Link>
                        <a href={sub.pdfUrl} className="action-btn view" target="_blank" rel="noopener noreferrer">View PDF</a>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="no-results">No submissions found for the selected filters.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};
export default AdminForms;
