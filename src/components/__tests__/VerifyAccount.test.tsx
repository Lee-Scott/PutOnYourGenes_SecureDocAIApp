import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import VerifyAccount from '../VerifyAccount';
import { userAPI } from '../../service/UserService';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
// No longer mocking the entire module

describe('VerifyAccount', () => {
  const verifyAccountFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(userAPI, 'useVerifyAccountMutation').mockReturnValue([verifyAccountFn, {
        isLoading: false,
        isSuccess: false,
        error: null,
        data: null,
        reset: vi.fn(),
    }]);
  });

  test('shows invalid link message when no key is present', () => {
    render(
      <MemoryRouter initialEntries={['/verify']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Invalid link/i)).toBeInTheDocument();
  });

  test('shows verifying message when key is present and loading', () => {
    (userAPI.useVerifyAccountMutation as Mock).mockReturnValue([verifyAccountFn, { 
        isLoading: true, 
        isSuccess: false, 
        error: null,
        data: null,
    }]);
    render(
      <MemoryRouter initialEntries={['/verify?key=somekey']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Please wait. Verifying.../i)).toBeInTheDocument();
  });

  test('calls verifyAccount mutation with the key from the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/verify?key=somekey']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(verifyAccountFn).toHaveBeenCalledWith('somekey');
    });
  });

  test('shows success message on verification success', async () => {
    (userAPI.useVerifyAccountMutation as Mock).mockReturnValue([verifyAccountFn, { 
        isLoading: false, 
        isSuccess: true, 
        error: null,
        data: { message: 'Account verified. You can log in now.' },
    }]);
    render(
      <MemoryRouter initialEntries={['/verify?key=somekey']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Account verified. You can log in now./i)).toBeInTheDocument();
  });

  test('shows error message on verification failure', async () => {
    const error = { data: { message: 'Verification failed' } };
    (userAPI.useVerifyAccountMutation as Mock).mockReturnValue([verifyAccountFn, { 
        isLoading: false, 
        isSuccess: false, 
        error: error,
        data: null,
    }]);
    render(
      <MemoryRouter initialEntries={['/verify?key=somekey']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Verification failed/i)).toBeInTheDocument();
  });

  test('shows specific error for used/invalid key', async () => {
    const error = { data: { message: 'Confirmation key not found' } };
    (userAPI.useVerifyAccountMutation as Mock).mockReturnValue([verifyAccountFn, { 
        isLoading: false, 
        isSuccess: false, 
        error: error,
        data: null,
    }]);
    render(
      <MemoryRouter initialEntries={['/verify?key=somekey']}>
        <Routes>
            <Route path="/verify" element={<VerifyAccount />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/This confirmation link has already been used or is invalid./i)).toBeInTheDocument();
  });
});
