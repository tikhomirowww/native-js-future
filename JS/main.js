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
const logoutBtn = document.querySelector("#logout");
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

//!edit
const editForm = document.querySelector(".editProduct");
const imgInpEdit = document.getElementById("imgInpEdit");
const titleInpEdit = document.getElementById("titleInpEdit");
const priceInpEdit = document.getElementById("priceInpEdit");
const categoryInpEdit = document.getElementById("categoryInpEdit");
const descriptionAreaEdit = document.getElementById("descriptionAreaEdit");

const cards = document.querySelector(".cards");
const divImg = document.getElementById("divImg");

//! search
const searchInp = document.querySelector(".search__input");

const PRODUCTS_API = "http://localhost:8000/products";

//!logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
});

async function getQuery(endpoint) {
  const res = await fetch(`http://localhost:8000/${endpoint}`);
  const data = await res.json();
  return data;
}

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
  modal.forEach((item) => (item.style.display = "none"));
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
    const data = await getQuery("users");
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

    localStorage.setItem(
      "user",
      JSON.stringify({ username: foundUser.username, email: foundUser.email })
    );
    getName();
    checkIsAdmin();
    render();
    loginForm.reset();
  }

  //! check admin

  function checkIsAdmin() {
    const email = JSON.parse(localStorage.getItem("user"))?.email;
    if (email !== "admin@gmail.com") {
      addBtn.style.display = "none";
      return false;
    } else {
      addBtn.style.display = "block";
      return true;
    }
  }
  checkIsAdmin();

  //! function add products to db

  addBtn.addEventListener("click", () => {
    addForm.style.display = "block";
    overlay.style.display = "block";
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  //! function get products from db
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
      console.log(response);
      imgInp.value = "";
      titleInp.value = "";
      priceInp.value = "";
      categoryInp.value = "";
      descriptionArea.value = "";
      closeModal();
      render(newProduct);
    } catch (error) {}
  });

  //! function render

  let search = "";
  let category = "";
  let page = 1;
  const limit = 2;

  async function render() {
    let API = category
      ? `${PRODUCTS_API}?q=${search}&category=${category}&_page=${page}&_limit=${limit}`
      : `${PRODUCTS_API}?q=${search}&_page=${page}&_limit=${limit}`;
    const res = await fetch(API);
    const data = await res.json();

    container.innerHTML = "";

    data.forEach((product) => {
      container.innerHTML += `
        <div class="producCard">
      <div class="card" style="width: 18rem;">
        <img  src=${product.image} class="card-img-top" alt="Product image">
        <div class="card-body">
          <h2 class="card-title">${product.title}</h2>
          <h5 class="card-price">${product.price}$</h5>
          <span class="card-category">${product.category}</span>
          <p class="card-text">${product.description}</p>
          ${
            checkIsAdmin()
              ? ` <div class="buttons">
                <button id=${product.id} class="edit-btn">Edit</button>
                <button id=${product.id} class="delete-btn">Delete</button>
              </div>`
              : ""
          }
        </div>
      </div>
      </div>
      `;
    });
  }

  render();

//! function see name

window.addEventListener("storage", getName);

function getName() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    username.innerText = user.username;
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

//! delete
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await fetch(`${PRODUCTS_API}/${e.target.id}`, { method: "DELETE" });
    render();
  }
});

//! edit

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const productId = e.target.id;
    editForm.style.display = "block";
    overlay.style.display = "block";
    const data = await getQuery(`products/${productId}`);
    titleInpEdit.value = data.title;
    priceInpEdit.value = data.price;
    categoryInpEdit.value = data.category;
    descriptionAreaEdit.value = data.description;
    imgInpEdit.value = data.image;
    id = productId;
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !titleInpEdit.value.trim() ||
    !priceInpEdit.value.trim() ||
    !descriptionAreaEdit.value.trim() ||
    !categoryInpEdit.value.trim() ||
    !imgInpEdit.value.trim()
  ) {
    alert("Some inputs are empty");
    return;
  }
  const editedObj = {
    title: titleInpEdit.value,
    price: priceInpEdit.value,
    description: descriptionAreaEdit.value,
    image: imgInpEdit.value,
    category: categoryInpEdit.value,
  };
  await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  closeModal();
});

//! search
searchInp.addEventListener("input", (e) => {
  console.log(e.target.value);
  search = e.target.value;
  render();
});

//! category
const categories = document.querySelectorAll(".first-level span");
console.log(categories);

categories.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (e.target.innerText === "All") {
      category = "";
    } else {
      category = e.target.innerText.toLowerCase();
    }
    render();
  });
});

//!pagination
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const pageSpan = document.querySelector("#pageNum");

async function checkPagination() {
  const data = await getQuery("products");
  const totalCount = Math.ceil(data.length / 2);
  if (page === totalCount) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "inline";
  }

  if (page === 1) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline";
  }
}
checkPagination();

prevBtn.addEventListener("click", () => {
  page--;
  checkPagination();
  pageSpan.innerText = page;
  render();
});

nextBtn.addEventListener("click", () => {
  page++;
  checkPagination();
  pageSpan.innerText = page;
  render();
});
