import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return the initial value', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should update the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'test2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('test2');
  });

  it('should reset the timeout on value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'test2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: 'test3', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('test');

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('test3');
  });
});
