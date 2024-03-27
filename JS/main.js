const registerBtn = document.querySelector("#registerBtn");
const overlay = document.querySelector(".overlay");
const form = document.querySelector(".form");
const singBtn = document.querySelector(".singUp_inForm");

singBtn.addEventListener("click", (e) => {
  e.preventDefault();
});

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  form.style.display = "block";
});

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  form.style.display = "none";
});

form.addEventListener("click", (event) => {
  event.stopPropagation();
});
