import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import resourceService from '../../services/resourceService';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: '',
    filePath: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } catch (err) {
      setError('Failed to fetch resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resourceService.createResource(formData);
      setShowAddModal(false);
      setFormData({ title: '', description: '', fileType: '', filePath: '' });
      fetchResources();
    } catch (err) {
      setError('Failed to create resource.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.deleteResource(id);
        fetchResources();
      } catch (err) {
        setError('Failed to delete resource.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-resources-page">
      <div className="resources-header">
        <h2>Manage Resources</h2>
        <button 
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add Resource
        </button>
      </div>

      <div className="resources-list">
        {resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          resources.map((resource) => (
            <div key={resource._id} className="resource-item">
              <div className="resource-info">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <span className="resource-type">{resource.fileType}</span>
              </div>
              <div className="resource-actions">
                <button className="download-button">
                  <FaDownload />
                </button>
                <button className="edit-button">
                  <FaEdit />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(resource._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Resource</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="File Type (e.g., PDF, DOCX)"
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="File Path/URL"
                value={formData.filePath}
                onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="primary-button">Add Resource</button>
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
