// Validation rules for authentication forms
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    message: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters'
  },
  phone: {
    pattern: /^\+?[\d\s-()]{10,15}$/,
    message: 'Please enter a valid phone number (10-15 digits)'
  },
  studentNumber: {
    pattern: /^\d{4,20}$/,
    message: 'Student number must be 4-20 digits'
  },
  name: {
    pattern: /^[a-zA-Z\s'-]{2,50}$/,
    message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes'
  }
};

// Real-time validation functions
export const validateField = (name, value) => {
  switch (name) {
    case 'email':
      return validationRules.email.pattern.test(value) ? '' : validationRules.email.message;
    
    case 'password':
      return validatePassword(value);
    
    case 'phone':
      return validationRules.phone.pattern.test(value) ? '' : validationRules.phone.message;
    
    case 'studentNumber':
      return validationRules.studentNumber.pattern.test(value) ? '' : validationRules.studentNumber.message;
    
    case 'firstName':
    case 'middleName':
    case 'lastName':
      return validationRules.name.pattern.test(value) ? '' : validationRules.name.message;
    
    default:
      return '';
  }
};

// Password strength validation
export const validatePassword = (password) => {
  if (password.length < validationRules.password.minLength) {
    return `Password must be at least ${validationRules.password.minLength} characters`;
  }
  
  if (validationRules.password.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (validationRules.password.requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (validationRules.password.requireNumbers && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (validationRules.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return '';
};

// Form validation helper
export const validateForm = (formData) => {
  const errors = {};
  
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });
  
  return errors;
};

// API endpoint configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Error messages
export const errorMessages = {
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  unauthorized: 'Invalid credentials. Please try again.',
  validation: 'Please correct the errors above.'
};
