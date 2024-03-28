const registerBtn = document.querySelector("#registerBtn");
const overlay = document.querySelector(".overlay");
const usernameInp = document.querySelector("#usernameInp");
const emailInp = document.querySelector("#emailInp");
const passwordInp = document.querySelector("#passwordInp");
const confirmInp = document.querySelector("#confirmInp");
const signUpBtn = document.querySelector("#signUp");
const form = document.querySelector(".form");
// login
const loginForm = document.querySelector(".loginForm");
const emailLoginInp = document.querySelector("#loginEmailInp");
const passwordLoginInp = document.querySelector("#loginPasswordInp");
const loginTrigger = document.querySelector("#loginTrigger");
const modal = document.querySelectorAll(".modal");
// add product
const addBtn = document.querySelector(".add");
const addProductBtn = document.querySelector("#addProductBtn");
const addForm = document.querySelector(".addProduct");

const imgInp = document.getElementById("imgInp");
const titleInp = document.getElementById("titleInp");
const priceInp = document.getElementById("priceInp");
const categoryInp = document.getElementById("categoryInp");
const descriptionArea = document.getElementById("descriptionArea");
const cards = document.querySelector(".cards");

// register
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  form.style.display = "block";
});

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  form.style.display = "none";
  modal.forEach((item) => (item.style.display = "none"));
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

  let users = await getUsers();

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

// login

loginTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  loginForm.style.display = "block";
});

async function login() {
  if (emailLoginInp.value.trim() || passwordLoginInp.value.trim()) {
    alert("Some inputs are empty");
    return;
  }

  let inDb = await uniqueEmail();

  let users = await getUsers();

  if (!inDb) {
    alert("Такого пользователя нет!");
    return;
  }

  const founObject = users.find((user) => user.email === emailLoginInp.value);
  if (founObject.password !== passwordLoginInp.value) {
    alert("Wrong password!");
  }

  localStorage.setItem("user", founObject.username);
}

// add product

addBtn.addEventListener("click", () => {
  addForm.style.display = "block";
});

addProductBtn.addEventListener("click", async () => {
  const imageSrc = document.getElementById("imgInp").value;
  const title = document.getElementById("titleInp").value;
  const price = document.getElementById("priceInp").value;
  const category = document.getElementById("categoryInp").value;
  const description = document.getElementById("descriptionArea").value;

  if (!imageSrc || !title || !price || !category || !description) {
    alert("Заполните все поля");
    return;
  }
  

  const productData = {
    image: imageSrc,
    title: title,
    price: price,
    category: category,
    description: description,
  };

  try {
    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      alert("Не удалось добавить продукт");
    }

    document.getElementById("imgInp").value = "";
    document.getElementById("titleInp").value = "";
    document.getElementById("priceInp").value = "";
    document.getElementById("categoryInp").value = "";
    document.getElementById("descriptionArea").value = "";

    overlay.style.display = "none";
    addForm.style.display = "none";

    render(productData);
  } catch (error) {
    console.error("Error:", error.message);
    alert("Failed to add product");
  }
});

function render(productData) {
  const cardHTML = `
    <div class="card" style="width: 18rem;">
      <img src="${productData.image}" class="card-img-top" alt="Product image">
      <div class="card-body">
        <h5 class="card-title">${productData.title}</h5>
        <h6 class="card-title">${productData.price}</h6>
        <p class="card-text">${productData.description}</p>
      </div>
    </div>
  `;

  const container = document.querySelector(".cards-container");
  container.innerHTML += cardHTML;
}

// see choosen img

const chooseImg = document.getElementById("chooseImg");

imgInp.addEventListener("change", () => {
  const file = imgInp.files[0];

  if (file && file.type.indexOf("image/") === 0) {
    const imageURL = URL.createObjectURL(file);

    chooseImg.style.backgroundImage = `url(${imageURL})`;
  }
});
