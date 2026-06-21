const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("newPromptBtn");
const closeBtn = document.getElementById("closeModalBtn");
const form = document.getElementById("promptForm");
const titleInput = document.getElementById("promptTitle");
const categoryInput = document.getElementById("promptCategory");
const cotentInput = document.getElementById("promptContent");
const emptyState = document.getElementById("emptyState");
let prompts = [];
let editingId = null;

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
    card.innerHTML = ` <h3> ${prompt.title} </h3> <span> ${prompt.category} </span> <p> ${prompt.content} </p> `;
    cardsContainer.appendChild(card);
  });
  card
    .querySelector(".edit-btn")
    .addEventListener("click", () => editPrompt(prompt.id));

  card
    .querySelector(".delete-btn")
    .addEventListener("click", () => deletePrompt(prompt.id));
}

//Delete
function deletePrompt(id) {
  prompts = prompts.filter(function (prompt) {
    return prompt.id !== id;
  });
  savePrompts();
  renderPrompts();
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
  prompts.push(prompt);
  renderPrompts();
  form.reset();
  modal.classList.remove("show");
});
renderPrompts();
