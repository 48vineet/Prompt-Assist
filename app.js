var modal = document.getElementById("modalOverlay");
var modalTitle = document.getElementById("modalTitle");
var form = document.getElementById("promptForm");
var titleInput = document.getElementById("promptTitle");
var categoryInput = document.getElementById("promptCategory");
var contentInput = document.getElementById("promptContent");
var cardsContainer = document.getElementById("cardsContainer");
var emptyState = document.getElementById("emptyState");
var searchInput = document.getElementById("searchInput");
var chips = document.querySelectorAll(".chip");
var totalEl = document.getElementById("totalPrompts");
var favEl = document.getElementById("favoriteCount");
var toastEl = document.getElementById("toastMsg");
var toastBox = document.getElementById("toast");
var expandOverlay = document.getElementById("expandOverlay");
var expandTitle = document.getElementById("expandTitle");
var expandBody = document.getElementById("expandBody");

var prompts = [];
var currentCategory = "All";
var searchTerm = "";
var editingId = null;
var expandContent = "";

var ICONS = {
  Coding: "fa-solid fa-code",
  Career: "fa-solid fa-bullseye",
  Writing: "fa-solid fa-pen-nib",
  Research: "fa-solid fa-flask",
  Design: "fa-solid fa-palette",
};

var themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeToggle.setAttribute("aria-label", "Switch to light mode");
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute("aria-label", "Switch to dark mode");
  }
}

function loadTheme() {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  var prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

themeToggle.addEventListener("click", function () {
  var nextTheme = document.body.classList.contains("dark-mode")
    ? "light"
    : "dark";
  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
});

// --- Storage ---

function save() {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

function load() {
  var stored = localStorage.getItem("prompts");
  if (stored) {
    try {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        prompts = parsed;
        render();
        return;
      }
    } catch (e) {
      /* fall through */
    }
  }
  if (window.DEFAULT_PROMPTS) {
    prompts = JSON.parse(JSON.stringify(window.DEFAULT_PROMPTS));
    save();
  }
  render();
}

// --- Helpers ---

function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toast(msg) {
  toastEl.textContent = msg;
  toastBox.classList.add("show");
  setTimeout(function () {
    toastBox.classList.remove("show");
  }, 2200);
}

function updateStats() {
  totalEl.textContent = prompts.length;
  favEl.textContent = prompts.filter(function (p) {
    return p.favorite;
  }).length;
}

// --- Modal ---

document.getElementById("newPromptBtn").addEventListener("click", function () {
  modalTitle.textContent = "Add a Prompt";
  editingId = null;
  form.reset();
  modal.classList.add("show");
});

document.getElementById("closeModalBtn").addEventListener("click", closeModal);
modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove("show");
  form.reset();
  editingId = null;
}

// --- Expand ---

document
  .getElementById("closeExpandBtn")
  .addEventListener("click", function () {
    expandOverlay.classList.remove("show");
  });
expandOverlay.addEventListener("click", function (e) {
  if (e.target === expandOverlay) expandOverlay.classList.remove("show");
});
document.getElementById("expandCopyBtn").addEventListener("click", function () {
  navigator.clipboard.writeText(expandContent);
  toast("Copied to clipboard");
});

function openExpand(p) {
  expandTitle.textContent = p.title;
  expandBody.textContent = p.content;
  expandContent = p.content;
  expandOverlay.classList.add("show");
}

// --- Search ---

searchInput.addEventListener("input", function () {
  searchTerm = searchInput.value.toLowerCase();
  render();
});

// --- Category ---

chips.forEach(function (btn) {
  btn.addEventListener("click", function () {
    chips.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    render();
  });
});

// --- Keyboard ---

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (expandOverlay.classList.contains("show"))
      expandOverlay.classList.remove("show");
    else if (modal.classList.contains("show")) closeModal();
  }
});

// --- Render ---

function render() {
  cardsContainer.innerHTML = "";
  var list = prompts.slice();

  if (searchTerm) {
    list = list.filter(function (p) {
      return (
        p.title.toLowerCase().indexOf(searchTerm) !== -1 ||
        p.content.toLowerCase().indexOf(searchTerm) !== -1
      );
    });
  }

  if (currentCategory === "Favorites") {
    list = list.filter(function (p) {
      return p.favorite;
    });
  } else if (currentCategory !== "All") {
    list = list.filter(function (p) {
      return p.category === currentCategory;
    });
  }

  if (!list.length) {
    emptyState.style.display = "block";
    updateStats();
    return;
  }

  emptyState.style.display = "none";

  list.forEach(function (p) {
    var card = document.createElement("div");
    card.className = "card";
    var icon = ICONS[p.category] || "fa-solid fa-file";
    var long = p.content.length > 180;

    card.innerHTML =
      '<div class="card-top">' +
      "<h3>" +
      esc(p.title) +
      "</h3>" +
      '<button class="card-fav' +
      (p.favorite ? " active" : "") +
      '">' +
      '<i class="fa-' +
      (p.favorite ? "solid" : "regular") +
      ' fa-star"></i>' +
      "</button>" +
      "</div>" +
      '<span class="card-badge ' +
      p.category +
      '"><i class="' +
      icon +
      '"></i> ' +
      p.category +
      "</span>" +
      '<div class="card-content"><p>' +
      esc(p.content) +
      "</p></div>" +
      (long ? '<button class="card-toggle">Read more</button>' : "") +
      '<div class="card-actions">' +
      '<button class="copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>' +
      '<button class="expand-btn"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> View</button>' +
      '<button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i> Edit</button>' +
      '<button class="delete-btn"><i class="fa-regular fa-trash-can"></i></button>' +
      "</div>";

    card.querySelector(".card-fav").onclick = function () {
      toggleFav(p.id);
    };
    card.querySelector(".copy-btn").onclick = function () {
      copy(p.id);
    };
    card.querySelector(".expand-btn").onclick = function () {
      openExpand(p);
    };
    card.querySelector(".edit-btn").onclick = function () {
      edit(p.id);
    };
    card.querySelector(".delete-btn").onclick = function () {
      del(p.id);
    };

    if (long) {
      var toggle = card.querySelector(".card-toggle");
      toggle.onclick = function () {
        var content = card.querySelector(".card-content");
        content.classList.toggle("expanded");
        toggle.textContent = content.classList.contains("expanded")
          ? "Show less"
          : "Read more";
      };
    }

    cardsContainer.appendChild(card);
  });

  updateStats();
}

// --- CRUD ---

function toggleFav(id) {
  var p = prompts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  p.favorite = !p.favorite;
  save();
  render();
  toast(p.favorite ? "Added to favorites" : "Removed from favorites");
}

function copy(id) {
  var p = prompts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  navigator.clipboard.writeText(p.content);
  toast("Prompt copied");
}

function del(id) {
  prompts = prompts.filter(function (x) {
    return x.id !== id;
  });
  save();
  render();
  toast("Prompt deleted");
}

function edit(id) {
  var p = prompts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  titleInput.value = p.title;
  categoryInput.value = p.category;
  contentInput.value = p.content;
  editingId = id;
  modalTitle.textContent = "Edit Prompt";
  modal.classList.add("show");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (editingId) {
    var idx = prompts.findIndex(function (x) {
      return x.id === editingId;
    });
    prompts[idx].title = titleInput.value;
    prompts[idx].category = categoryInput.value;
    prompts[idx].content = contentInput.value;
    toast("Prompt updated");
    editingId = null;
  } else {
    prompts.unshift({
      id: Date.now(),
      title: titleInput.value,
      category: categoryInput.value,
      content: contentInput.value,
      favorite: false,
    });
    toast("Prompt created");
  }

  save();
  render();
  form.reset();
  modal.classList.remove("show");
});

// --- Init ---

loadTheme();
load();
