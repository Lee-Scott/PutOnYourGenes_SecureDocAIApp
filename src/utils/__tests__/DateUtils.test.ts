import { formatDate } from '../DateUtils';
import { describe, it, expect } from 'vitest';

describe('DateUtils', () => {
  describe('formatDate', () => {
    it('should format a valid date string', () => {
      const dateString = '2023-10-27T10:00:00.000Z';
      // Note: The exact output can vary based on the test runner's timezone.
      // This test assumes a specific timezone for consistency.
      const result = formatDate(dateString);
      expect(result).toContain('Oct 27, 2023');
    });

    it('should return "N/A" for a null date string', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('should return "N/A" for an undefined date string', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });

    it('should return "Invalid Date" for an invalid date string', () => {
      expect(formatDate('not a date')).toBe('Invalid Date');
    });
  });
});
