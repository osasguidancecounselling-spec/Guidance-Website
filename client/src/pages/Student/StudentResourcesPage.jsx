import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import './StudentResourcesPage.css';

const StudentResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourceService.getResources();
        setResources(data);
        setError('');
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ['all', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="student-resources-page">
      <div className="resources-header">
        <h1>Student Resources</h1>
        <p>Access helpful resources for your academic and personal development</p>
      </div>

      <div className="resources-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="category-filter">
          <label>Filter by category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading resources...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <div className="resources-grid">
            {filteredResources.map(resource => (
              <div key={resource._id} className="resource-card">
                <div className="resource-header">
                  <span className={`resource-type ${resource.type.toLowerCase()}`}>
                    {resource.type}
                  </span>
                  <span className="resource-category">{resource.category}</span>
                </div>
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                  Access Resource <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="no-resources">
              <p>No resources found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentResourcesPage;
