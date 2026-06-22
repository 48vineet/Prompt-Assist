const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("newPromptBtn");
const closeBtn = document.getElementById("closeModalBtn");
const form = document.getElementById("promptForm");
const titleInput = document.getElementById("promptTitle");
const categoryInput = document.getElementById("promptCategory");
const contentInput = document.getElementById("promptContent");
const cardsContainer = document.getElementById("cardsContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");
const totalPrompts = document.getElementById("totalPrompts");
const favoriteCount = document.getElementById("favoriteCount");
const toast = document.getElementById("toast");

let currentCategory = "All";
let searchTerm = "";
let prompts = [];
let editingId = null;

// Local Storage
function savePrompts() {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

async function loadPrompts() {
  const savedPrompts = localStorage.getItem("prompts");

  if (savedPrompts) {
    prompts = JSON.parse(savedPrompts);
    renderPrompts();
    return;
  }

  try {
    const response = await fetch("./prompts.json");

    prompts = await response.json();

    savePrompts();

    renderPrompts();
  } catch (error) {
    console.error("Failed to load prompts", error);
  }
}

// Toast
function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Stats
function updateStats() {
  totalPrompts.textContent = prompts.length;

  favoriteCount.textContent = prompts.filter(
    (prompt) => prompt.favorite,
  ).length;
}

// Modal
openBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  form.reset();
  editingId = null;
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");

    form.reset();

    editingId = null;
  }
});

// Search
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderPrompts();
});

// Category Filter
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((button) => {
      button.classList.remove("active");
    });

    btn.classList.add("active");

    currentCategory = btn.dataset.category;

    renderPrompts();
  });
});

// Render
function renderPrompts() {
  cardsContainer.innerHTML = "";

  let filteredPrompts = [...prompts];

  // Search

  if (searchTerm) {
    filteredPrompts = filteredPrompts.filter((prompt) => {
      return (
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.content.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Category

  if (currentCategory === "Favorites") {
    filteredPrompts = filteredPrompts.filter((prompt) => prompt.favorite);
  } else if (currentCategory !== "All") {
    filteredPrompts = filteredPrompts.filter(
      (prompt) => prompt.category === currentCategory,
    );
  }

  // Empty State

  if (filteredPrompts.length === 0) {
    emptyState.style.display = "block";

    updateStats();

    return;
  }

  emptyState.style.display = "none";

  filteredPrompts.forEach((prompt) => {
    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <h3>${prompt.title}</h3>

      <span>${prompt.category}</span>

      <p>${prompt.content}</p>

      <div class="card-actions">

        <button class="favorite-btn">
          ${prompt.favorite ? "★" : "☆"}
        </button>

        <button class="copy-btn">
          Copy
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    card.querySelector(".favorite-btn").addEventListener("click", () => {
      toggleFavorite(prompt.id);
    });

    card.querySelector(".copy-btn").addEventListener("click", () => {
      copyPrompt(prompt.id);
    });

    card.querySelector(".edit-btn").addEventListener("click", () => {
      editPrompt(prompt.id);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deletePrompt(prompt.id);
    });

    cardsContainer.appendChild(card);
  });

  updateStats();
}

// Favorite

function toggleFavorite(id) {
  const prompt = prompts.find((prompt) => prompt.id === id);

  if (!prompt) return;

  prompt.favorite = !prompt.favorite;

  savePrompts();

  renderPrompts();

  showToast(prompt.favorite ? "Added to favorites" : "Removed from favorites");
}

// Copy

function copyPrompt(id) {
  const prompt = prompts.find((prompt) => prompt.id === id);

  if (!prompt) return;

  navigator.clipboard.writeText(prompt.content);

  showToast("Prompt copied");
}

// Delete

function deletePrompt(id) {
  prompts = prompts.filter((prompt) => prompt.id !== id);

  savePrompts();

  renderPrompts();

  showToast("Prompt deleted");
}

// Edit

function editPrompt(id) {
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) return;

  titleInput.value = prompt.title;

  categoryInput.value = prompt.category;

  contentInput.value = prompt.content;

  editingId = id;

  modal.classList.add("show");
}

// Create / Update

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editingId) {
    const index = prompts.findIndex((p) => p.id === editingId);

    prompts[index] = {
      ...prompts[index],

      title: titleInput.value,

      category: categoryInput.value,

      content: contentInput.value,
    };

    showToast("Prompt updated");

    editingId = null;
  } else {
    prompts.unshift({
      id: Date.now(),

      title: titleInput.value,

      category: categoryInput.value,

      content: contentInput.value,

      favorite: false,
    });

    showToast("Prompt created");
  }

  savePrompts();

  renderPrompts();

  form.reset();

  modal.classList.remove("show");
});
loadPrompts();
