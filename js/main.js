/**
 * Application entry point.
 * Imports all modules, wires up global listeners, and boots the app.
 */

import { initTheme }         from './theme.js';
import { initModal, closeModal } from './modal.js';
import { initExpand, closeExpand } from './expand.js';
import { initRender }         from './render.js';
import { loadPrompts }         from './storage.js';

// ── Global keyboard shortcuts ────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;

  const expandOverlay = document.getElementById('expandOverlay');
  const modalOverlay  = document.getElementById('modalOverlay');

  if (expandOverlay?.classList.contains('show')) {
    closeExpand();
  } else if (modalOverlay?.classList.contains('show')) {
    closeModal();
  }
});

// ── Boot ─────────────────────────────────────────────────────

initTheme();
initModal();
initExpand();
initRender();
loadPrompts();
