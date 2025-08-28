import React, { useState } from 'react';
import FormBuilder from '../../components/forms/FormBuilder';
import DocxUploader from '../../components/forms/DocxUploader';
import './AdminForms.css';

const AdminForms = () => {
  const [activeTab, setActiveTab] = useState('builder');

  // We can pass a function to refetch a list of forms later
  const handleFormCreation = (newForm) => {
    console.log('A new form was created:', newForm);
    // Here you would typically update a list of all forms
  };

  return (
    <div className="admin-forms-page">
      <h1>Form Management</h1>
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>
          Form Builder
        </button>
        <button className={`tab-btn ${activeTab === 'uploader' ? 'active' : ''}`} onClick={() => setActiveTab('uploader')}>
          Upload .docx Template
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'builder' && <FormBuilder onFormCreated={handleFormCreation} />}
        {activeTab === 'uploader' && <DocxUploader onFormUploaded={handleFormCreation} />}
      </div>
    </div>
  );
};

export default AdminForms;