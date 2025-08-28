import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import announcementService from '../../services/announcementService';
import './Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await announcementService.createAnnouncement(formData);
      setShowAddModal(false);
      setFormData({ title: '', content: '' });
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to create announcement.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        fetchAnnouncements();
      } catch (err) {
        setError('Failed to delete announcement.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-announcements-page">
      <div className="announcements-header">
        <h2>Manage Announcements</h2>
        <button 
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add Announcement
        </button>
      </div>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <p>No announcements found.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-item">
              <div className="announcement-info">
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
                <span className="announcement-date">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="announcement-actions">
                <button className="edit-button">
                  <FaEdit />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(announcement._id)}
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
            <h3>Add New Announcement</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="primary-button">Add Announcement</button>
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

export default Announcements;
