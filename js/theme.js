/**
 * Dark / Light theme toggle.
 * - Persists preference in localStorage.
 * - Respects `prefers-color-scheme` on first visit.
 * - Updates the toggle button icon (moon ↔ sun).
 */

import dom from './dom.js';

const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

/**
 * Apply theme to the document and update the toggle icon.
 * @param {'light'|'dark'} theme
 */
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const icon = dom.themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === DARK
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  }
};

/**
 * Determine the initial theme: saved preference → system preference → light.
 * @returns {'light'|'dark'}
 */
const getInitialTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === DARK || saved === LIGHT) return saved;

  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? DARK
    : LIGHT;
};

/**
 * Toggle between light and dark, persisting the choice.
 */
const toggle = () => {
  const next = document.documentElement.dataset.theme === DARK ? LIGHT : DARK;
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
};

/**
 * Initialise theme system: apply initial theme + wire up toggle button.
 */
export const initTheme = () => {
  applyTheme(getInitialTheme());
  dom.themeToggle?.addEventListener('click', toggle);
};
