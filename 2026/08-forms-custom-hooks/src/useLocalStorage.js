// We need useState to store a value.
// We need useEffect to save the value when it changes.
import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  // Create state.
  // But before using initialValue,
  // first check if something is already saved in localStorage.
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : initialValue;
  });

  // Every time key or value changes,
  // save the new value in localStorage.
  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);

  // Return it like useState.
  return [value, setValue];
}