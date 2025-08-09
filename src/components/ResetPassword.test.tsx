import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { userAPI } from '../service/UserService';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
vi.mock('../service/UserService', () => ({
  userAPI: {
    useResetPasswordMutation: vi.fn(),
  },
}));

describe('ResetPassword', () => {
  const resetPasswordFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (userAPI.useResetPasswordMutation as Mock).mockReturnValue([resetPasswordFn, { 
        isLoading: false, 
        isSuccess: false, 
        data: undefined,
    }]);
  });

  test('renders the reset password form', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
  });

  test('shows validation errors for invalid input', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  test('calls resetPassword mutation on form submission', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    await waitFor(() => {
      expect(resetPasswordFn).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });
});
