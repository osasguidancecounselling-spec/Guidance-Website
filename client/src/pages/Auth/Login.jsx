import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import "./Login.css";

const Login = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const loginIdentifier = isStudent ? { studentNumber } : { email };
      const result = await login({ ...loginIdentifier, password });
      if (!result.success) {
        setMessage(`❌ ${result.error || "Login failed. Please check your credentials."}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(`❌ ${error.message || "An unexpected error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Cavite State University Logo" className="login-logo" />
          <div className="login-header-title">Cavite State University</div>
          <div className="login-header-subtitle">CCAT Campus</div>
          <div className="login-header-portal">Guidance Counseling Portal</div>
        </div>

        <div className="login-toggle">
          <button 
            className={`toggle-button ${isStudent ? 'active' : ''}`}
            onClick={() => setIsStudent(true)}
          >
            Student
          </button>
          <button 
            className={`toggle-button ${!isStudent ? 'active' : ''}`}
            onClick={() => setIsStudent(false)}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {isStudent ? (
            <input 
              type="text" 
              className="login-input" 
              placeholder="Student Number" 
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
            />
          ) : (
            <input 
              type="email" 
              className="login-input" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="forgot-password">
            <a href={isStudent ? "/forgot-password" : "/admin-forgot-password"}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className={`form-message ${message.startsWith("✅") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
