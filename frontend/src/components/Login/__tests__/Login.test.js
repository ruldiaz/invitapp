import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from '../../Login/Login';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Mocking useNavigate and useDispatch
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('Login Component', () => {
  let navigate;
  let dispatch;

  beforeEach(() => {
    navigate = jest.fn();
    dispatch = jest.fn();
    useNavigate.mockReturnValue(navigate);
    useDispatch.mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText(/Node.js Passport Auth App/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
  
  test('shows error message if form is submitted with empty fields', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(await screen.findByText(/Incomplete form. All fields required./i)).toBeInTheDocument();
  });
  
  test('handles login success correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Success', redirectTo: '/profile' }),
      })
    );
  
    render(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'auth/loginSuccess' });
      expect(sessionStorage.getItem('isAuthenticated')).toBe('true');
      expect(navigate).toHaveBeenCalledWith('/profile');
    });
  });
  
  test('handles login failure correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: 'Invalid credentials' }),
      })
    );
  
    render(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(await screen.findByText(/Failed to login. Invalid credentials/i)).toBeInTheDocument();
  });

  test('parses email from URL parameters', () => {
    // Mock window.location.search
    window.history.pushState({}, 'Test title', '?email=test@example.com');

    render(<Login />);

    expect(screen.getByPlaceholderText(/Email/i).value).toBe('test@example.com');
  });
});
