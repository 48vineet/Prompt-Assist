/**
 * Cached DOM element references.
 * Centralises all querySelector calls for better performance and readability.
 */

import { $ } from './utils.js';

const dom = Object.freeze({
  // Header
  searchInput:    $('#searchInput'),
  newPromptBtn:   $('#newPromptBtn'),

  // Stats
  totalPrompts:   $('#totalPrompts'),
  favoriteCount:  $('#favoriteCount'),

  // Cards
  cardsContainer: $('#cardsContainer'),
  emptyState:     $('#emptyState'),

  // Modal (Add / Edit)
  modalOverlay:   $('#modalOverlay'),
  modalTitle:     $('#modalTitle'),
  promptForm:     $('#promptForm'),
  promptTitle:    $('#promptTitle'),
  promptCategory: $('#promptCategory'),
  promptContent:  $('#promptContent'),
  closeModalBtn:  $('#closeModalBtn'),

  // Expand (View Full)
  expandOverlay:  $('#expandOverlay'),
  expandTitle:    $('#expandTitle'),
  expandBody:     $('#expandBody'),
  closeExpandBtn: $('#closeExpandBtn'),
  expandCopyBtn:  $('#expandCopyBtn'),

  // Toast
  toast:          $('#toast'),
  toastMsg:       $('#toastMsg'),

  // Theme
  themeToggle:    $('#themeToggle'),
});

export default dom;
