import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../login';
import { userAPI } from '../../../service/UserService';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
vi.mock('../../../service/UserService', () => ({
  userAPI: {
    useLoginUserMutation: vi.fn(),
    useVerifyQrCodeMutation: vi.fn(),
  },
}));

describe('Login', () => {
  // Define mocks ahead of time
  const loginUserFn = vi.fn();
  const verifyQrCodeFn = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Provide a default mock for both mutations before each test
    (userAPI.useLoginUserMutation as Mock).mockReturnValue([loginUserFn, { 
        isLoading: false, 
        isSuccess: false, 
        data: undefined,
    }]);
    (userAPI.useVerifyQrCodeMutation as Mock).mockReturnValue([verifyQrCodeFn, {
        isLoading: false,
        isSuccess: false,
    }]);
  });

  test('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('shows validation errors for invalid input', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  test('calls loginUser mutation on form submission', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(loginUserFn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  test('renders MFA form when mfa is true in the API response', async () => {
    // Arrange: Set up the mock to simulate a successful login requiring MFA
    (userAPI.useLoginUserMutation as Mock).mockReturnValue([
      loginUserFn,
      {
        isSuccess: true,
        data: { data: { user: { mfa: true, userId: '12345' } } },
      },
    ]);

    const { rerender } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Act: Simulate the state update by re-rendering
    rerender(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

    // Assert: Check that the MFA form is now visible
    await waitFor(() => {
        expect(screen.getByText(/2-Step Verification/i)).toBeInTheDocument();
    });
  });

  test('calls verifyQrCode mutation on MFA form submission', async () => {
    // Arrange: Mock the login mutation to return a success state that requires MFA
    (userAPI.useLoginUserMutation as Mock).mockReturnValue([
      loginUserFn,
      {
        isSuccess: true,
        data: { data: { user: { mfa: true, userId: '12345' } } },
      },
    ]);
    // Arrange: Mock the QR code verification mutation
    (userAPI.useVerifyQrCodeMutation as Mock).mockReturnValue([verifyQrCodeFn, { isLoading: false }]);

    const { rerender } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Act: Re-render to simulate the component updating after the mocked login call
    rerender(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

    // Assert: Wait for the MFA form to appear
    await waitFor(() => {
      expect(screen.getByText(/2-Step Verification/i)).toBeInTheDocument();
    });

    // Act: Fill out and submit the MFA form
    fireEvent.input(screen.getByTestId('qrCode1'), { target: { value: '1' } });
    fireEvent.input(screen.getByTestId('qrCode2'), { target: { value: '2' } });
    fireEvent.input(screen.getByTestId('qrCode3'), { target: { value: '3' } });
    fireEvent.input(screen.getByTestId('qrCode4'), { target: { value: '4' } });
    fireEvent.input(screen.getByTestId('qrCode5'), { target: { value: '5' } });
    fireEvent.input(screen.getByTestId('qrCode6'), { target: { value: '6' } });

    // Wait for the form to be valid and the button to be enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Verify/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    // Assert: Check that the verifyQrCode mutation was called with the correct data
    await waitFor(() => {
      expect(verifyQrCodeFn).toHaveBeenCalledWith({
        userId: '12345',
        qrCode: '123456'
      });
    });
  });
});
