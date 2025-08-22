import { render, screen } from '@testing-library/react';
import Loader from '../Loader';
import { describe, it, expect } from 'vitest';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});