import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';
import VerifyPassword from '../VerifyPassword';
import { userAPI } from '../../service/UserService';

// Mock the userAPI
// No longer mocking the entire module

describe('VerifyPassword', () => {
  const verifyPasswordFn = vi.fn();
  const doResetPasswordFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(userAPI, 'useVerifyPasswordMutation').mockReturnValue([verifyPasswordFn, {
        isLoading: false,
        isSuccess: false,
        error: null,
        data: null,
        reset: vi.fn(),
    }]);
    vi.spyOn(userAPI, 'useDoResetPasswordMutation').mockReturnValue([doResetPasswordFn, {
        isLoading: false,
        isSuccess: false,
        error: null,
        data: null,
        reset: vi.fn(),
    }]);
  });

  test('shows invalid link message when no key is present', () => {
    render(
      <MemoryRouter initialEntries={['/verify/password']}>
        <VerifyPassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/Invalid link/i)).toBeInTheDocument();
  });

  test('shows verifying message when key is present', () => {
    (userAPI.useVerifyPasswordMutation as Mock).mockReturnValue([verifyPasswordFn, { 
        isLoading: true, 
        isSuccess: false, 
        error: null,
        data: null,
    }]);
    render(
      <MemoryRouter initialEntries={['/verify/password?key=somekey']}>
        <Routes>
            <Route path="/verify/password" element={<VerifyPassword />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Please wait. Verifying.../i)).toBeInTheDocument();
    expect(verifyPasswordFn).toHaveBeenCalledWith('somekey');
  });

  test('shows error message on verification failure', () => {
    const error = { data: { message: 'Verification failed' } };
    (userAPI.useVerifyPasswordMutation as Mock).mockReturnValue([verifyPasswordFn, { 
        isLoading: false, 
        isSuccess: false, 
        error: error,
        data: null,
    }]);
    render(
        <MemoryRouter initialEntries={['/verify/password?key=somekey']}>
            <Routes>
                <Route path="/verify/password" element={<VerifyPassword />} />
            </Routes>
        </MemoryRouter>
    );
    expect(screen.getByText(/Verification failed/i)).toBeInTheDocument();
  });

  test('renders password form on verification success', () => {
    const successData = { data: { user: { userId: '1234' } } };
    (userAPI.useVerifyPasswordMutation as Mock).mockReturnValue([verifyPasswordFn, { 
        isLoading: false, 
        isSuccess: true, 
        error: null,
        data: successData,
    }]);
    render(
        <MemoryRouter initialEntries={['/verify/password?key=somekey']}>
            <Routes>
                <Route path="/verify/password" element={<VerifyPassword />} />
            </Routes>
        </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  test('calls reset password mutation on form submission', async () => {
    const successData = { data: { user: { userId: '1234' } } };
    (userAPI.useVerifyPasswordMutation as Mock).mockReturnValue([verifyPasswordFn, { 
        isLoading: false, 
        isSuccess: true, 
        error: null,
        data: successData,
    }]);
     render(
        <MemoryRouter initialEntries={['/verify/password?key=somekey']}>
            <Routes>
                <Route path="/verify/password" element={<VerifyPassword />} />
            </Routes>
        </MemoryRouter>
    );

    fireEvent.input(screen.getByPlaceholderText('New password'), { target: { value: 'newpassword123' } });
    fireEvent.input(screen.getByPlaceholderText('Confirm new password'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(doResetPasswordFn).toHaveBeenCalledWith({
        userId: '1234',
        newPassword: 'newpassword123',
        confirmNewPassword: 'newpassword123',
      });
    });
  });
});
