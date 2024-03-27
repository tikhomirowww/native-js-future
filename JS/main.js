// register connections
const registerBtn = document.querySelector("#registerBtn");
const overlay = document.querySelector(".overlay");
const form = document.querySelector(".form");
const usernameInp = document.querySelector("#usernameInp");
const emailInp = document.querySelector("#emailInp");
const passwordInp = document.querySelector("#passwordInp");
const confirmInp = document.querySelector("#confirmInp");
const signUpBtn = document.querySelector("#signUp");
// login connections
const emailLoginInp = document.querySelector("#loginEmailInp");
const passwordLoginInp = document.querySelector("#loginPasswordInp");
const loginForm = document.querySelector(".loginForm");
const loginTrigger = document.querySelector("#loginTrigger");
const modal = document.querySelectorAll(".modal");
const username = document.querySelector("#name");

//register logic
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  form.style.display = "block";
});

function closeModal() {
  overlay.style.display = "none";
  modal.forEach((item) => (item.style.display = "none"));
}

overlay.addEventListener("click", closeModal);

form.addEventListener("submit", (event) => {
  event.stopPropagation();
  event.preventDefault();
  registration();
});

async function registration() {
  if (passwordInp.length < 8) {
    console.error("Ваш пароль должен быть больше 8 символов!");
    return;
  }

  if (passwordInp.value !== confirmInp.value) {
    console.error("Пароль и подтверждение пароля не совпадают");
    return;
  }

  let users = await getUsers();

  if (users.some((item) => item.email === emailInp.value)) {
    alert("Такой пользователь уже есть");
    return;
  }
  let data = {
    username: usernameInp.value,
    email: emailInp.value,
    password: passwordInp.value,
  };
  console.log(data);

  try {
    await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  }

  form.reset();
  closeModal();
}

async function getUsers() {
  let res = await fetch("http://localhost:8000/users");
  let data = await res.json();
  console.log(data);

  return data;
}

//login logic
loginTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  loginForm.style.display = "block";
});

async function login() {
  if (!emailLoginInp.value.trim() || !passwordLoginInp.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  let users = await getUsers();

  if (users.some((item) => item.email === emailInp.value)) {
    alert("User not found!");
    return;
  }

  const foundObj = users.find((user) => user.email === emailLoginInp.value);
  if (foundObj.password !== passwordLoginInp.value) {
    alert("Wrong password!!! (Uhodi)");
    return;
  }

  localStorage.setItem("user", foundObj.username);
  loginForm.reset();
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
  closeModal();
});

window.addEventListener("storage", getName);

function getName() {
  let user = localStorage.getItem("user");
  if (user) {
    username.innerText = user;
  } else {
    username.innerText = "";
  }
}
getName();
