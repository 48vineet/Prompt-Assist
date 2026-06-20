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
