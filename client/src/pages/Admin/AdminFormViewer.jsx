// client/src/pages/Admin/AdminFormViewer.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AdminFormViewer.css"; // We'll define this style next

const AdminFormViewer = () => {
  const { filename } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [formTitle, setFormTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/forms/parse/${filename}`);
        const data = await res.json();
        setQuestions(data.questions);
        setFormTitle(data.title);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching form:", err);
        setLoading(false);
      }
    };
    fetchForm();
  }, [filename]);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const response = await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "admin",
          filename: formTitle,
          answers,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Form submitted and saved as PDF!");
      } else {
        setMessage(`❌ ${result.message || "Submission failed."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  if (loading) return <div className="form-viewer-loading">Loading form...</div>;

  return (
    <div className="form-viewer-container">
      <div className="form-viewer-card">
        <h2 className="form-title">{formTitle.replace(".docx", "")}</h2>
        <form onSubmit={handleSubmit} className="form-question-list">
          {questions.map((q) => (
            <div key={q.id} className="form-question-item">
              <label>{q.question}</label>
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" className="form-submit-btn">Submit</button>
        </form>
        {message && <div className="form-message">{message}</div>}
      </div>
    </div>
  );
};

export default AdminFormViewer;
