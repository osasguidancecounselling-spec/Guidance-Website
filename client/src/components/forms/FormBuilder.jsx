import React, { useState } from 'react';
import { formService } from '../../services/formService';
import { toast } from 'react-toastify';

const FormBuilder = ({ onFormCreated }) => {
  const [formTitle, setFormTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addField = () => {
    // Add a new field with a unique temporary ID for the key prop
    setFields([...fields, { label: '', type: 'text', required: false }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.warn('Please provide a form title.');
      return;
    }
    if (fields.length === 0) {
      toast.warn('Please add at least one field to the form.');
      return;
    }

    setIsSubmitting(true);

    // Transform frontend fields to match backend `questions` schema
    // The backend model expects `question`, not `label`.
    const questions = fields.map(field => ({
      question: field.label,
      type: field.type,
      // 'required' is not in the backend model, so it's not sent
    }));

    try {
      const response = await formService.createForm({ title: formTitle, questions });
      toast.success(response.message || 'Form created successfully!');
      
      // Reset form state
      setFormTitle('');
      setFields([]);

      if (onFormCreated) onFormCreated(response.form);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-builder">
      <h2>Create New Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Form Title:</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="button" onClick={addField}>Add Field</button>
        </div>
        {fields.map((field, index) => (
          <div key={index} className="form-field">
            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => updateField(index, 'label', e.target.value)}
              required
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="checkbox">Checkbox</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(index, 'required', e.target.checked)}
              />
              Required
            </label>
            <button type="button" onClick={() => removeField(index)}>Remove</button>
          </div>
        ))}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Form'}
        </button>
      </form>
    </div>
  );
};

export default FormBuilder;
