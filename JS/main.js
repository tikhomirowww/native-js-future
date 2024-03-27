const registerBtn = document.querySelector("#registerBtn");
const overlay = document.querySelector(".overlay");
const form = document.querySelector(".form");
const usernameInp = document.querySelector("#usernameInp");
const emailInp = document.querySelector("#emailInp");
const passwordInp = document.querySelector("#passwordInp");
const confirmInp = document.querySelector("#confirmInp");
const signUpBtn = document.querySelector("#signUp");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  form.style.display = "block";
});

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  form.style.display = "none";
});

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

  let inDb = await uniqueEmail(emailInp.value);
  console.log(inDb);
  if (inDb) {
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
  overlay.style.display = "none";
  form.style.display = "none";
}

async function uniqueEmail(email) {
  let res = await fetch("http://localhost:8000/users");
  let data = await res.json();
  console.log(data);

  return data.some((item) => item.email === email);
}
uniqueEmail();
