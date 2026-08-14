import { useCallback, useState } from 'react';

const STORAGE_KEY = 'pokebinder-shiny-mode';

function readStoredShiny(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function useShinyMode() {
  const [shiny, setShinyState] = useState(readStoredShiny);

  const setShiny = useCallback((value: boolean) => {
    setShinyState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleShiny = useCallback(() => {
    setShinyState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  return { shiny, setShiny, toggleShiny };
}
