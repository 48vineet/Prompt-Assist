const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("newPromptBtn");
const closeBtn = document.getElementById("closeModalBtn");
const form = document.getElementById("promptForm");
const titleInput = document.getElementById("promptTitle");
const categoryInput = document.getElementById("promptCategory");
const cotentInput = document.getElementById("promptContent");
const emptyState = document.getElementById("emptyState");
let prompts = [];

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

// Render
function renderPrompts() {
  cardsContainer.innerHTML = "";
  if (prompts.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";
  prompts.forEach((prompt) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = ` <h3> ${prompt.title} </h3> <span> ${prompt.category} </span> <p> ${prompt.content} </p> <div class="card-actions"> <button class="edit-btn" data-id="${prompt.id}" > Edit </button> <button class="delete-btn" data-id="${prompt.id}" > Delete </button> </div> `;
    cardsContainer.appendChild(card);
  });
}
// Create Prompt
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = {
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
  } else {
    prompts.unshift(prompt);
  }

  renderPrompts();
  form.reset();
  modal.classList.remove("show");
});
renderPrompts();

function editPrompt(id) {
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) return;

  titleInput.value = prompt.title;

  categoryInput.value = prompt.category;

  contentInput.value = prompt.content;

  editingId = id;

  modal.classList.add("show");
}
