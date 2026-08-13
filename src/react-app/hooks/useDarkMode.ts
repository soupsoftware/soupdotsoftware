import { useEffect, useState } from 'react';

/**
 * Custom hook to manage the dark mode state of the application.
 *
 * Why:
 * We want to respect the user's system preferences by default, but allow them
 * to manually override the theme. Persisting the choice in `localStorage` ensures
 * a consistent experience across sessions without flashing the wrong theme.
 *
 * @returns {Object} An object containing the current dark mode state (`isDark`) and a setter function (`setIsDark`).
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return { isDark, setIsDark };
}
