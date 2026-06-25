/**
 * Expand (View Full Prompt) overlay controller.
 * Shows full prompt content in a scrollable panel with a copy button.
 */

import dom from './dom.js';
import { toast } from './utils.js';

/** Currently displayed prompt content for copying. */
let expandContent = '';

/** Close the expand overlay. */
const closeExpand = () => {
  dom.expandOverlay.classList.remove('show');
};

/**
 * Open the expand overlay with the given prompt's data.
 * @param {{title: string, content: string}} prompt
 */
export const openExpand = (prompt) => {
  dom.expandTitle.textContent = prompt.title;
  dom.expandBody.textContent = prompt.content;
  expandContent = prompt.content;
  dom.expandOverlay.classList.add('show');
};

/** Copy the expanded prompt's content to clipboard. */
const copyExpandContent = async () => {
  await navigator.clipboard.writeText(expandContent);
  toast('Copied to clipboard');
};

/** Initialise expand overlay event listeners. */
export const initExpand = () => {
  dom.closeExpandBtn.addEventListener('click', closeExpand);

  dom.expandOverlay.addEventListener('click', (e) => {
    if (e.target === dom.expandOverlay) closeExpand();
  });

  dom.expandCopyBtn.addEventListener('click', copyExpandContent);
};

export { closeExpand };
