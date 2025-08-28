import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../../pages/Auth/Login';

// Mock the AuthContext
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loading: false,
    error: null,
  }),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error message when error exists', () => {
    // Mock AuthContext with error
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: 'Invalid credentials',
    });
    
    render(<Login />);
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('shows loading state when loading', () => {
    // Mock AuthContext with loading
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: jest.fn(),
      loading: true,
      error: null,
    });
    
    render(<Login />);
    
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });
});
