import React, { useState } from 'react';
import { formService } from '../../services/formService';
import { toast } from 'react-toastify';

const DocxUploader = ({ onFormUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid .docx file.');
      setSelectedFile(null);
      e.target.value = null; // Reset the file input
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await formService.uploadForm(selectedFile);
      toast.success(response.message || 'Form uploaded and parsed successfully!');
      if (onFormUploaded) {
        onFormUploaded(response.form);
      }
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload form.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="docx-uploader">
      <h2>Upload .docx Template</h2>
      <p>Upload a .docx file with questions. The system will automatically parse it into a digital form.</p>
      <div className="upload-area">
        <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload and Parse'}
        </button>
      </div>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
};

export default DocxUploader;