import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ForgotPassword.css";

const AdminForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/admin-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'osasguidancecounselling@gmail.com',
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Failed to reset password'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* University Header */}
        <div className="login-header">
          <img src="/logo.png" alt="Cavite State University Logo" className="login-logo" />
          <div className="login-header-title">Cavite State University</div>
          <div className="login-header-subtitle">CCAT Campus</div>
          <div className="login-header-portal">Admin Password Reset Portal</div>
        </div>

        <p className="login-subtitle">Create your new admin password</p>
        
        <form onSubmit={handlePasswordReset} className="login-form">
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="login-input"
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

          <div className="password-input-wrapper">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Re-enter New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        {message && (
          <p className={`form-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="signup-prompt">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
