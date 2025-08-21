import { render, screen } from '@testing-library/react';
import Restricted from '../Restricted';
import { describe, it, expect, vi } from 'vitest';
import { userAPI } from '../../service/UserService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../service/UserService');

describe('Restricted', () => {
  it('renders loading state', () => {
    vi.mocked(userAPI.useFetchUserQuery).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    render(<Restricted />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(userAPI.useFetchUserQuery).mockReturnValue({
      data: { data: { user: null } } as any,
      error: { data: { message: 'An error occurred' } } as any,
      isLoading: false,
    });
    render(
      <MemoryRouter>
        <Restricted />
      </MemoryRouter>
    );
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders access denied for non-admin users', () => {
    vi.mocked(userAPI.useFetchUserQuery).mockReturnValue({
      data: { data: { user: { role: 'USER' } } },
      error: undefined,
      isLoading: false,
    });
    render(
      <MemoryRouter>
        <Restricted />
      </MemoryRouter>
    );
    expect(screen.getByText('ACCESS DENIED')).toBeInTheDocument();
  });
});