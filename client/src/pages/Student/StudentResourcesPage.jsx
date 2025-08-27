import React, { useState } from 'react';
import './StudentResourcesPage.css';

const StudentResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample resources data - in a real app, this would come from an API
  const resources = [
    {
      id: 1,
      title: 'College Application Guide',
      category: 'college',
      description: 'Comprehensive guide to college applications, deadlines, and requirements',
      link: '/resources/college-guide.pdf',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Career Assessment Test',
      category: 'career',
      description: 'Take our career assessment to discover your strengths and interests',
      link: '/career-assessment',
      type: 'Interactive'
    },
    {
      id: 3,
      title: 'Scholarship Opportunities',
      category: 'financial',
      description: 'List of available scholarships and application deadlines',
      link: '/resources/scholarships',
      type: 'Webpage'
    },
    {
      id: 4,
      title: 'Mental Health Resources',
      category: 'wellness',
      description: 'Resources for mental health support and counseling services',
      link: '/resources/mental-health',
      type: 'Directory'
    },
    {
      id: 5,
      title: 'Study Skills Workshop',
      category: 'academic',
      description: 'Improve your study habits and time management skills',
      link: '/resources/study-skills',
      type: 'Workshop'
    },
    {
      id: 6,
      title: 'Resume Building Template',
      category: 'career',
      description: 'Professional resume templates and writing tips',
      link: '/resources/resume-template.docx',
      type: 'Template'
    }
  ];

  const categories = ['all', 'college', 'career', 'financial', 'wellness', 'academic'];

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

      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <span className={`resource-type ${resource.type.toLowerCase()}`}>
                {resource.type}
              </span>
              <span className="resource-category">{resource.category}</span>
            </div>
            <h3 className="resource-title">{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            <a href={resource.link} className="resource-link">
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
    </div>
  );
};

export default StudentResourcesPage;
