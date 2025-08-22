// client/src/pages/Shared/AnswerForm.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AnswerForm = ({ role = "student", studentInfo }) => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`/api/forms/${formId}`);
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load form", err);
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (qText, value) => {
    setAnswers((prev) => ({ ...prev, [qText]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        formId,
        answers,
        userRole: role,
        studentInfo: role === "student" ? studentInfo : null,
      };

      const res = await axios.post(`/api/forms/submit/${formId}`, payload);
      alert(`PDF generated: ${res.data.filename}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Form not found.</p>;
  if (submitted) return <p>Thank you! Your response was submitted.</p>;

  return (
    <div className="form-answer-container">
      <h2>{form.title}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {form.questions.map((q, idx) => (
          <div key={idx} className="form-group">
            <label>{q.question}</label>
            <input
              type="text"
              className="form-control"
              value={answers[q.question] || ""}
              onChange={(e) => handleChange(q.question, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;
