/**
 * Shared utility helpers for Prompt Assist.
 * Provides DOM shortcuts, HTML escaping, and toast notifications.
 */

/** Shorthand for `document.querySelector`. */
export const $ = (selector) => document.querySelector(selector);

/** Shorthand for `document.querySelectorAll`. */
export const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str — raw string
 * @returns {string} — safe HTML string
 */
export const escapeHtml = (str) =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/**
 * Displays a brief toast notification.
 * @param {string} message — text to show
 * @param {number} [duration=2200] — display time in ms
 */
export const toast = (message, duration = 2200) => {
  const msgEl = $('#toastMsg');
  const box = $('#toast');
  msgEl.textContent = message;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), duration);
};

/** Category → Font Awesome icon class mapping. */
export const CATEGORY_ICONS = Object.freeze({
  Coding:   'fa-solid fa-code',
  Career:   'fa-solid fa-bullseye',
  Writing:  'fa-solid fa-pen-nib',
  Research: 'fa-solid fa-flask',
  Design:   'fa-solid fa-palette',
});
