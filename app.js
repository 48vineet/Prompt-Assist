const modal = document.getElementById( "modalOverlay" );
const openBtn = document.getElementById( "newPromptBtn" ); 
const closeBtn = document.getElementById( "closeModalBtn" );

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


//hehehehe
const model= document.getElementById("modelOverlay");
const openBtn=document.getElementById("newPromptBtn");
const closeBtn=document.getElementById("closeModelBtn");
