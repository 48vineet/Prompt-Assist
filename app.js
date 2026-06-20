const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("newPromptBtn");
const closeBtn = document.getElementById("closeModalBtn");

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
}
// Create Prompt
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = {
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
