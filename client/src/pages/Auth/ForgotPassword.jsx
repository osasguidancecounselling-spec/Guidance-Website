import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import { validatePassword } from "../../utils/validation";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [securityAnswers, setSecurityAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: ""
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState({});
  const [resetToken, setResetToken] = useState(null);

  const handleStudentNumberSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/forgot-password/find-student", { studentNumber });
      setSecurityQuestions(res.data.questions);
      setStep(2);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "An error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityAnswersSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/forgot-password/verify-answers", {
        studentNumber,
        answers: securityAnswers,
      });
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Verification failed."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(`❌ ${passwordError}`);
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      await api.post("/auth/forgot-password/reset", {
        resetToken,
        newPassword,
      });
      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Password reset failed."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (e, questionNumber) => {
    setSecurityAnswers({
      ...securityAnswers,
      [`answer${questionNumber}`]: e.target.value
    });
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* University Header */}
        <div className="login-header">
          <img src="/logo.png" alt="Cavite State University Logo" className="login-logo" />
          <div className="login-header-title">Cavite State University</div>
          <div className="login-header-subtitle">CCAT Campus</div>
          <div className="login-header-portal">Password Reset Portal</div>
        </div>

        {step === 1 && (
          <>
            <p className="login-subtitle">Enter your student number to reset password</p>
            
            <form onSubmit={handleStudentNumberSubmit} className="login-form">
              <input
                type="text"
                placeholder="Student Number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="login-input"
                required
              />

              <button type="submit" className="primary-button" disabled={isLoading}>
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="login-subtitle">Answer your security questions</p>
            
            <form onSubmit={handleSecurityAnswersSubmit} className="login-form">
              <div className="security-question">
                <label className="question-label">{securityQuestions.question1}</label>
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswers.answer1}
                  onChange={(e) => handleAnswerChange(e, 1)}
                  className="login-input"
                  required
                />
              </div>

              <div className="security-question">
                <label className="question-label">{securityQuestions.question2}</label>
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswers.answer2}
                  onChange={(e) => handleAnswerChange(e, 2)}
                  className="login-input"
                  required
                />
              </div>

              <div className="security-question">
                <label className="question-label">{securityQuestions.question3}</label>
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswers.answer3}
                  onChange={(e) => handleAnswerChange(e, 3)}
                  className="login-input"
                  required
                />
              </div>

              <button type="submit" className="primary-button" disabled={isLoading}>
                Verify Answers
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="login-subtitle">Create your new password</p>
            
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
                Save New Password
              </button>
            </form>
          </>
        )}

        {message && (
          <p className={`form-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="signup-prompt">
          Remembered your password? <Link to="/">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
