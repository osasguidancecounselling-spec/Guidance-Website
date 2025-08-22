import React, { useState } from 'react';

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState('');
  const [fields, setFields] = useState([]);

  const addField = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit form data to backend
    console.log({ formTitle, fields });
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
        <button type="submit">Save Form</button>
      </form>
    </div>
  );
};

export default FormBuilder;
