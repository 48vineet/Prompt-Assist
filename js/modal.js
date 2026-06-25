/**
 * Add / Edit prompt modal controller.
 * Handles opening, closing, form submission, and CRUD for prompts.
 */

import dom from './dom.js';
import state, { emit } from './state.js';
import { savePrompts } from './storage.js';
import { toast } from './utils.js';

/** Close the modal and reset form state. */
const closeModal = () => {
  dom.modalOverlay.classList.remove('show');
  dom.promptForm.reset();
  state.editingId = null;
};

/** Open the modal in "Add" mode. */
const openAddModal = () => {
  dom.modalTitle.textContent = 'Add a Prompt';
  state.editingId = null;
  dom.promptForm.reset();
  dom.modalOverlay.classList.add('show');
};

/**
 * Open the modal in "Edit" mode for the given prompt ID.
 * @param {number} id
 */
export const openEditModal = (id) => {
  const prompt = state.prompts.find((p) => p.id === id);
  if (!prompt) return;

  dom.promptTitle.value = prompt.title;
  dom.promptCategory.value = prompt.category;
  dom.promptContent.value = prompt.content;
  state.editingId = id;
  dom.modalTitle.textContent = 'Edit Prompt';
  dom.modalOverlay.classList.add('show');
};

/**
 * Handle form submission — create or update a prompt.
 * @param {SubmitEvent} e
 */
const handleSubmit = (e) => {
  e.preventDefault();

  const { promptTitle, promptCategory, promptContent } = dom;

  if (state.editingId !== null) {
    const idx = state.prompts.findIndex((p) => p.id === state.editingId);
    if (idx !== -1) {
      Object.assign(state.prompts[idx], {
        title:    promptTitle.value,
        category: promptCategory.value,
        content:  promptContent.value,
      });
    }
    toast('Prompt updated');
    state.editingId = null;
  } else {
    state.prompts.unshift({
      id:       Date.now(),
      title:    promptTitle.value,
      category: promptCategory.value,
      content:  promptContent.value,
      favorite: false,
    });
    toast('Prompt created');
  }

  savePrompts();
  emit('render');
  closeModal();
};

/** Initialise modal event listeners. */
export const initModal = () => {
  dom.newPromptBtn.addEventListener('click', openAddModal);
  dom.closeModalBtn.addEventListener('click', closeModal);

  dom.modalOverlay.addEventListener('click', (e) => {
    if (e.target === dom.modalOverlay) closeModal();
  });

  dom.promptForm.addEventListener('submit', handleSubmit);
};

export { closeModal };
