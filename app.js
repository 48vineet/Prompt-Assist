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

let currentCategory = "All";
let searchTerm = "";
let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

let editingId = null;

// LocalStorage

function savePrompts() {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

// Modal
openBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
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

  // Search Filter

  if (searchTerm) {
    filteredPrompts = filteredPrompts.filter((prompt) => {
      return (
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.content.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Category Filter

  if (currentCategory !== "All") {
    filteredPrompts = filteredPrompts.filter((prompt) => {
      return prompt.category === currentCategory;
    });
  }

  // Empty State

  if (filteredPrompts.length === 0) {
    emptyState.style.display = "block";

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

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => {
      editPrompt(prompt.id);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deletePrompt(prompt.id);
    });

    cardsContainer.appendChild(card);
  });
}

// Delete

function deletePrompt(id) {
  prompts = prompts.filter((prompt) => prompt.id !== id);

  savePrompts();

  renderPrompts();
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

// Create Prompt

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const prompt = {
    id: Date.now(),

    title: titleInput.value,

    category: categoryInput.value,

    content: contentInput.value,
  };

  if (editingId) {
    const index = prompts.findIndex((p) => p.id === editingId);

    prompts[index] = {
      id: editingId,

      title: titleInput.value,

      category: categoryInput.value,

      content: contentInput.value,
    };

    editingId = null;

    savePrompts();
  } else {
    prompts.unshift(prompt);

    savePrompts();
  }

  renderPrompts();

  form.reset();

  modal.classList.remove("show");
});

renderPrompts();
