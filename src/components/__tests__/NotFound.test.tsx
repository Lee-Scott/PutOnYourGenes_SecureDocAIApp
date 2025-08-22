import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound', () => {
  it('renders without crashing', () => {
    render(<NotFound />);
    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });
});