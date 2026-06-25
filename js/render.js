/**
 * Card grid rendering module.
 * Renders filtered prompt cards — NO "Read More" button.
 * Cards remain at a fixed max-height with a CSS fade overlay.
 */

import dom from './dom.js';
import state, { emit, on } from './state.js';
import { savePrompts } from './storage.js';
import { escapeHtml, toast, CATEGORY_ICONS, $$ } from './utils.js';
import { openEditModal } from './modal.js';
import { openExpand } from './expand.js';

// ── CRUD helpers ─────────────────────────────────────────────

const toggleFavorite = (id) => {
  const prompt = state.prompts.find((p) => p.id === id);
  if (!prompt) return;
  prompt.favorite = !prompt.favorite;
  savePrompts();
  emit('render');
  toast(prompt.favorite ? 'Added to favorites' : 'Removed from favorites');
};

const copyPrompt = async (id) => {
  const prompt = state.prompts.find((p) => p.id === id);
  if (!prompt) return;
  await navigator.clipboard.writeText(prompt.content);
  toast('Prompt copied');
};

const deletePrompt = (id) => {
  state.prompts = state.prompts.filter((p) => p.id !== id);
  savePrompts();
  emit('render');
  toast('Prompt deleted');
};

// ── Stats ────────────────────────────────────────────────────

const updateStats = () => {
  dom.totalPrompts.textContent = state.prompts.length;
  dom.favoriteCount.textContent = state.prompts.filter((p) => p.favorite).length;
};

// ── Filter ───────────────────────────────────────────────────

const getFilteredPrompts = () => {
  let list = [...state.prompts];

  if (state.searchTerm) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(state.searchTerm) ||
        p.content.toLowerCase().includes(state.searchTerm),
    );
  }

  if (state.currentCategory === 'Favorites') {
    list = list.filter((p) => p.favorite);
  } else if (state.currentCategory !== 'All') {
    list = list.filter((p) => p.category === state.currentCategory);
  }

  return list;
};

// ── Card builder ─────────────────────────────────────────────

/**
 * Build a single card DOM element for a prompt.
 * No "Read More" button — content stays collapsed with a CSS fade.
 */
const buildCard = (prompt) => {
  const card = document.createElement('div');
  card.className = 'card';

  const icon = CATEGORY_ICONS[prompt.category] ?? 'fa-solid fa-file';
  const favClass = prompt.favorite ? ' active' : '';
  const favIcon = prompt.favorite ? 'solid' : 'regular';

  card.innerHTML = `
    <div class="card-top">
      <h3>${escapeHtml(prompt.title)}</h3>
      <button class="card-fav${favClass}" aria-label="Toggle favorite">
        <i class="fa-${favIcon} fa-star"></i>
      </button>
    </div>
    <span class="card-badge ${prompt.category}">
      <i class="${icon}"></i> ${prompt.category}
    </span>
    <div class="card-content"><p>${escapeHtml(prompt.content)}</p></div>
    <div class="card-actions">
      <button class="copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>
      <button class="expand-btn"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> View</button>
      <button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i> Edit</button>
      <button class="delete-btn"><i class="fa-regular fa-trash-can"></i></button>
    </div>`;

  // Wire up action handlers
  card.querySelector('.card-fav').onclick   = () => toggleFavorite(prompt.id);
  card.querySelector('.copy-btn').onclick   = () => copyPrompt(prompt.id);
  card.querySelector('.expand-btn').onclick = () => openExpand(prompt);
  card.querySelector('.edit-btn').onclick   = () => openEditModal(prompt.id);
  card.querySelector('.delete-btn').onclick = () => deletePrompt(prompt.id);

  return card;
};

// ── Main render ──────────────────────────────────────────────

const render = () => {
  dom.cardsContainer.innerHTML = '';
  const list = getFilteredPrompts();

  if (!list.length) {
    dom.emptyState.style.display = 'block';
    updateStats();
    return;
  }

  dom.emptyState.style.display = 'none';

  const fragment = document.createDocumentFragment();
  for (const prompt of list) {
    fragment.appendChild(buildCard(prompt));
  }
  dom.cardsContainer.appendChild(fragment);

  updateStats();
};

// ── Initialise ───────────────────────────────────────────────

export const initRender = () => {
  // Subscribe to the "render" event
  on('render', render);

  // Search input
  dom.searchInput.addEventListener('input', () => {
    state.searchTerm = dom.searchInput.value.toLowerCase();
    render();
  });

  // Category filter chips
  for (const chip of $$('.chip')) {
    chip.addEventListener('click', () => {
      for (const c of $$('.chip')) c.classList.remove('active');
      chip.classList.add('active');
      state.currentCategory = chip.dataset.category;
      render();
    });
  }
};
