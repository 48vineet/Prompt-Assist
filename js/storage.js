/**
 * localStorage abstraction for prompt data persistence.
 * Falls back to DEFAULT_PROMPTS from prompts-data.js on first load.
 */

import state, { emit } from './state.js';

const STORAGE_KEY = 'prompts';

/**
 * Persist current prompts array to localStorage.
 */
export const savePrompts = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts));
};

/**
 * Load prompts from localStorage (or seed from defaults) and trigger a render.
 */
export const loadPrompts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        state.prompts = parsed;
        emit('render');
        return;
      }
    } catch {
      /* corrupted data — fall through to defaults */
    }
  }

  // Seed from global DEFAULT_PROMPTS (loaded via non-module script)
  if (globalThis.DEFAULT_PROMPTS) {
    state.prompts = structuredClone(globalThis.DEFAULT_PROMPTS);
    savePrompts();
  }

  emit('render');
};
