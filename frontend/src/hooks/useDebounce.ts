import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapidly changing values (like search input typing).
 * Delays updating the returned value until the user stops typing for `delayMs`.
 */
export function useDebounce<T>(value: T, delayMs = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cleanup: cancels previous timer if value changes before delayMs
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

