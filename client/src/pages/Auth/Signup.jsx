import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL, validateForm } from "../../utils/validation";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentNumber: "",
    course: "",
    year: "",
    section: "",
    email: "",
    securityQ1: "",
    securityQ2: "",
    securityQ3: "",
    answer1: "",
    answer2: "",
    answer3: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const errors = validateForm(formData);
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      // Display the first error found
      const firstError = Object.values(errors)[0];
      setMessage(`❌ ${firstError}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          studentNumber: formData.studentNumber,
          course: formData.course,
          year: formData.year,
          section: formData.section,
          securityQuestions: {
            question1: "What was your first pet's name?",
            answer1: formData.answer1,
            question2: "What is your favorite food?",
            answer2: formData.answer2,
            question3: "What city were you born in?",
            answer3: formData.answer3
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("✅ Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || "Registration failed"}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setMessage("❌ Cannot connect to server. Please ensure the server is running on http://localhost:5000");
      } else {
        setMessage("❌ Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {isLoading && (
        <div className="loading-overlay">
          <img src="/logo.png" alt="Loading" className="loading-logo" />
          <div className="loading-text">Creating account...</div>
        </div>
      )}

      <div className="signup-card">
        {/* Logo and Header */}
        <img src="/logo.png" alt="Cavite State University Logo" className="signup-logo" />
        <h1 className="signup-title">Cavite State University</h1>
        <h2 className="signup-subtitle">CCAT Campus</h2>
        <h3 className="signup-portal">Guidance Counseling Portal</h3>
        <p className="signup-description">Create your account</p>

        {message && (
          <p className={`form-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-columns">
            {/* First Column */}
            <div className="signup-column">
              <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="middleName" 
                placeholder="Middle Name" 
                value={formData.middleName} 
                onChange={handleChange} 
              />
              <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="studentNumber" 
                placeholder="Student Number" 
                value={formData.studentNumber} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />

              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="">Select Course</option>
                <option>BS Computer Science</option>
                <option>BS Information Technology</option>
                <option>BS Business Administration</option>
                <option>BS Industrial Technology</option>
                <option>BS Electrical Engineering</option>
                <option>BS Computer Engineering</option>
                <option>BS Secondary Education</option>
                <option>BS Technical-Vocational Teacher Education</option>
                <option>BS Hospitality Management</option>
              </select>

              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Year Level</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
              {/* Section moved to second column */}
            </div>

            {/* Second Column */}
            <div className="signup-column">
              <label className="security-label">Security Questions</label>
              
              <select name="section" value={formData.section} onChange={handleChange} required>
                <option value="">Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
              </select>
              
              <div className="security-question-group">
                <input 
                  type="text" 
                  name="answer1" 
                  placeholder="What was your first pet's name?" 
                  value={formData.answer1} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="security-question-group">
                <input 
                  type="text" 
                  name="answer2" 
                  placeholder="What is your favorite food?" 
                  value={formData.answer2} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="security-question-group">
                <input 
                  type="text" 
                  name="answer3" 
                  placeholder="What city were you born in?" 
                  value={formData.answer3} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-login-link">
          Already have an account? <Link to="/">Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;