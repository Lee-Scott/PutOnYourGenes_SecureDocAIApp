import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../NavBar';
import { userAPI } from '../../../service/UserService';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';

// Mock the userAPI
vi.mock('../../../service/UserService', () => ({
  userAPI: {
    useFetchUserQuery: vi.fn(),
    useLogoutMutation: vi.fn(),
  },
}));

describe('NavBar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  test('renders navigation links', () => {
    // Mock the return value of useFetchUserQuery
    (userAPI.useFetchUserQuery as Mock).mockReturnValue({
      data: {
        data: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            imageUrl: 'https://via.placeholder.com/150',
            role: 'USER',
          },
        },
      },
      error: null,
      isLoading: false,
    });

    // Mock the return value of useLogoutMutation
    (userAPI.useLogoutMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Check for navigation links
    expect(screen.getByText(/Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Questionnaires/i)).toBeInTheDocument();
  });
});
