import React, { useState, useEffect } from 'react';

const FormRenderer = ({ formId }) => {
  const [form] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // TODO: Fetch form data by formId from backend
  }, [formId]);

  const handleChange = (fieldLabel, value) => {
    setResponses({ ...responses, [fieldLabel]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit responses to backend
    console.log(responses);
  };

  if (!form) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.title}</h2>
      {form.fields.map((field, index) => {
        switch (field.type) {
          case 'text':
            return (
              <div key={index}>
                <label>{field.label}</label>
                <input
                  type="text"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              </div>
            );
          case 'textarea':
            return (
              <div key={index}>
                <label>{field.label}</label>
                <textarea
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              </div>
            );
          case 'number':
            return (
              <div key={index}>
                <label>{field.label}</label>
                <input
                  type="number"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              </div>
            );
          case 'date':
            return (
              <div key={index}>
                <label>{field.label}</label>
                <input
                  type="date"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              </div>
            );
          case 'checkbox':
            return (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(field.label, e.target.checked)}
                  />
                  {field.label}
                </label>
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormRenderer;
