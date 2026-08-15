import { type Dispatch, type SetStateAction } from 'react';

type ThemeToggleProps = {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
};

/**
 * A button component that toggles the application between light and dark modes.
 * 
 * Why:
 * Isolating the toggle into its own component improves modularity and keeps
 * the main App component clean. It handles its own accessibility labels and 
 * conditional icon rendering based on the active theme.
 * 
 * @param {ThemeToggleProps} props - Component props containing the current theme state and its setter.
 */
export function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}
