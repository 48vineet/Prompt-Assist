/**
 * Centralized application state with a pub-sub event emitter.
 * Any module can subscribe to state changes without tight coupling.
 */

/** @type {Map<string, Set<Function>>} */
const listeners = new Map();

/**
 * Subscribe to a named event.
 * @param {string} event — event name (e.g. "render", "statsUpdate")
 * @param {Function} callback
 */
export const on = (event, callback) => {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);
};

/**
 * Emit a named event, calling all registered callbacks.
 * @param {string} event
 * @param  {...any} args — forwarded to callbacks
 */
export const emit = (event, ...args) => {
  listeners.get(event)?.forEach((fn) => fn(...args));
};

/** Application state — single source of truth. */
const state = {
  /** @type {Array<{id:number, title:string, category:string, content:string, favorite:boolean}>} */
  prompts: [],

  /** Currently active filter category. */
  currentCategory: 'All',

  /** Current search query (lowercase). */
  searchTerm: '',

  /** ID of the prompt being edited, or `null`. */
  editingId: null,
};

export default state;
