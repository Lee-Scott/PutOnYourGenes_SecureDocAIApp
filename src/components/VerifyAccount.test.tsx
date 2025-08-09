import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import VerifyAccount from './VerifyAccount';
import { userAPI } from '../service/UserService';
import { setupStore } from '../store/store';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
vi.mock('../service/UserService', () => ({
  userAPI: {
    useVerifyAccountMutation: vi.fn(),
  },
}));

describe('VerifyAccount', () => {
  const verifyAccountFn = vi.fn();
  const store = setupStore();

  beforeEach(() => {
    vi.clearAllMocks();
    (userAPI.useVerifyAccountMutation as Mock).mockReturnValue([verifyAccountFn, { 
        isLoading: false, 
        isSuccess: true, 
        data: { data: { message: 'Account verified successfully' } },
    }]);
  });

  test('renders the verification message', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/verify/account/some-key']}>
          <Routes>
              <Route path="/verify/account/:key" element={<VerifyAccount />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText(/Account verified successfully/i)).toBeInTheDocument();
  });

  test('calls verifyAccount mutation with the key from the URL', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/verify/account/some-key']}>
            <Routes>
                <Route path="/verify/account/:key" element={<VerifyAccount />} />
            </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(verifyAccountFn).toHaveBeenCalledWith({ key: 'some-key' });
    });
  });
});
