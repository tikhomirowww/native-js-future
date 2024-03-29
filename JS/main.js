// register connections
const registerBtn = document.querySelector("#registerBtn");
const overlay = document.querySelector(".overlay");
const usernameInp = document.querySelector("#usernameInp");
const emailInp = document.querySelector("#emailInp");
const passwordInp = document.querySelector("#passwordInp");
const confirmInp = document.querySelector("#confirmInp");
const signUpBtn = document.querySelector("#signUp");
const form = document.querySelector(".form");
//! login
const loginForm = document.querySelector(".loginForm");
const emailLoginInp = document.querySelector("#loginEmailInp");
const passwordLoginInp = document.querySelector("#loginPasswordInp");
const loginTrigger = document.querySelector("#loginTrigger");
const modal = document.querySelectorAll(".modal");
const username = document.querySelector("#name");
//! add product
const addBtn = document.querySelector(".add");
const addProductBtn = document.querySelector("#addProductBtn");
const addForm = document.querySelector(".addProduct");
const container = document.querySelector(".cards-container");
const newModal = document.querySelector(".new");

const imgInp = document.getElementById("imgInp");
const titleInp = document.getElementById("titleInp");
const priceInp = document.getElementById("priceInp");
const categoryInp = document.getElementById("categoryInp");
const descriptionArea = document.getElementById("descriptionArea");
const cards = document.querySelector(".cards");
const divImg = document.getElementById("divImg");

//! register

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  form.style.display = "block";
});

loginTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  loginForm.style.display = "block";
});

overlay.addEventListener("click", closeModal);

addForm.addEventListener("click", function (event) {
  event.stopPropagation();
});

//! close modal

function closeModal() {
  overlay.style.display = "none";
  form.style.display = "none";
  loginForm.style.display = "none";
  addForm.style.display = "none";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await registration();
});

//! function registartion

async function registration() {
  if (passwordInp.value.length < 8) {
    console.error("Password must be more than 8 characters!");
    return;
  }

  if (passwordInp.value !== confirmInp.value) {
    console.error("Password and its confirmation don't match!");
    return;
  }

  let users = await getUsers();

  if (users.some((item) => item.email === emailInp.value)) {
    alert("This email is already taken!");
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

//! function login

async function getUsers() {
  let res = await fetch("http://localhost:8000/users");
  let data = await res.json();
  console.log(data);
  return data;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await login();
  closeModal();
});

async function login() {
  if (!emailLoginInp.value.trim() || !passwordLoginInp.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  let users = await getUsers();

  const foundUser = users.find((user) => user.email === emailLoginInp.value);

  if (!foundUser) {
    alert("User not found!");
    return;
  }

  if (foundUser.password !== passwordLoginInp.value) {
    alert("Wrong password!");
    return;
  }

  localStorage.setItem("user", foundUser.username);
  loginForm.reset();
}

//! function add products to db

addBtn.addEventListener("click", () => {
  addForm.style.display = "block";
  overlay.style.display = "block";
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

addProductBtn.addEventListener("click", async () => {
  if (
    !imgInp.value ||
    !titleInp.value ||
    !priceInp.value ||
    !categoryInp.value ||
    !descriptionArea.value
  ) {
    alert("Some inputs are empty!");
    return;
  }
  const newProduct = {
    image: imgInp.value,
    title: titleInp.value,
    price: priceInp.value,
    category: categoryInp.value,
    description: descriptionArea.value,
  };

  try {
    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      alert("Failed to add product");
    } else {
      imgInp.value = "";
      titleInp.value = "";
      priceInp.value = "";
      categoryInp.value = "";
      descriptionArea.value = "";
      closeModal();
      render(newProduct);
    }
  } catch (error) {
    console.error(error);
  }
});

//! function get products from db

addProductBtn.addEventListener("click", async () => {
  try {
    const newProduct = {
      image: imgInp.value,
      title: titleInp.value,
      price: priceInp.value,
      category: categoryInp.value,
      description: descriptionArea.value,
    };

    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const responseData = await response.json();
    render(responseData);
    closeModal();
  } catch (error) {
    console.error(error);
    alert("Failed to add product");
  }
});

//! function render

function render(products) {
  container.innerHTML = "";

  products.forEach((product) => {
    container.innerHTML += `
      <img src="${product.image}" alt="${product.title}">
      <p><strong>Title:</strong> ${product.title}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Description:</strong> ${product.description}</p>
    `;
  });
}

//! function see name

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

//! categories

document.addEventListener("DOMContentLoaded", function () {
  let catalogSections = document.querySelectorAll(".left-catalog-section");

  catalogSections.forEach(function (section) {
    section.addEventListener("click", function (event) {
      event.preventDefault();

      let subCategories = this.querySelector(".left-catalog-section-sections");

      subCategories.style.display =
        subCategories.style.display === "none" ? "block" : "none";

      let arrow = this.querySelector("svg");
      arrow.parentNode.classList.toggle("collapsed");
    });
  });
});
