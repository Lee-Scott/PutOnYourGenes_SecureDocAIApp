import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../Register';
import { userAPI } from '../../service/UserService';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
// No longer mocking the entire module

describe('Register', () => {
  const registerUserFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(userAPI, 'useRegisterUserMutation').mockReturnValue([registerUserFn, {
        isLoading: false,
        isSuccess: false,
        data: undefined,
        reset: vi.fn(),
    }]);
  });

  test('renders the register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('shows validation errors for invalid input', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  test('calls registerUser mutation on form submission', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.input(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.input(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(registerUserFn).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
      });
    });
  });
});
