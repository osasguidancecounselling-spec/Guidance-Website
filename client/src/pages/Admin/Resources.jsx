import React, { useState } from 'react';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'College Application Guide',
      category: 'college',
      description: 'Comprehensive guide to college applications, deadlines, and requirements',
      uploadDate: '2024-01-15',
      downloads: 245
    },
    {
      id: 2,
      title: 'Scholarship Database',
      category: 'financial',
      description: 'Database of available scholarships with deadlines and requirements',
      uploadDate: '2024-01-10',
      downloads: 189
    },
    {
      id: 3,
      title: 'Career Assessment Test',
      category: 'career',
      description: 'Interactive career assessment tool for students',
      uploadDate: '2024-01-08',
      downloads: 312
    }
  ]);

  const [newResource, setNewResource] = useState({
    title: '',
    category: '',
    description: '',
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setNewResource(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (newResource.title && newResource.category && newResource.file) {
      const newResourceObj = {
        id: resources.length + 1,
        title: newResource.title,
        category: newResource.category,
        description: newResource.description,
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0
      };
      setResources(prev => [...prev, newResourceObj]);
      setNewResource({
        title: '',
        category: '',
        description: '',
        file: null
      });
    }
  };

  const handleDeleteResource = (id) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  return (
    <div className="admin-resources-page">
      <h1>Admin Resources Management</h1>
      
      <div className="admin-resources-controls">
        <h2>Add New Resource</h2>
        <form onSubmit={handleAddResource} className="admin-resources-form">
          <input
            type="text"
            name="title"
            placeholder="Resource Title"
            value={newResource.title}
            onChange={handleInputChange}
            required
          />
          <select
            name="category"
            value={newResource.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="college">College</option>
            <option value="career">Career</option>
            <option value="financial">Financial</option>
            <option value="wellness">Wellness</option>
            <option value="academic">Academic</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={newResource.description}
            onChange={handleInputChange}
            rows="3"
          />
          <input
            type="file"
            onChange={handleFileUpload}
            required
          />
          <button type="submit">Upload Resource</button>
        </form>
      </div>

      <div>
        <h2>Existing Resources</h2>
        <table className="admin-resources-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Upload Date</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource.id}>
                <td>{resource.title}</td>
                <td>{resource.category}</td>
                <td>{resource.uploadDate}</td>
                <td>{resource.downloads}</td>
                <td>
                  <button>Edit</button>
                  <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resources;
