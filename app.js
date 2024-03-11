// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".movie-form");
const movie = document.getElementById("movie");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".movie-container");
const list = document.querySelector(".movie-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem)
// clear items
clearBtn.addEventListener("click", clearItems)
// load items
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = movie.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem(id, value);
        // display alert
        displayAlert(`${value} added to the list`, "success");
        // show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert(`${value} changed`, "success");
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("please enter an item", "danger");
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1500)
}

// clear items
function clearItems() {
    const items = document.querySelectorAll(".movie-item");
    
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("emptied the list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
// delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert(`item removed`, "danger");
    setBackToDefault();
    // remove from locale storage
    removeFromLocalStorage(id);
}

// edit function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    movie.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault() {
    movie.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const movie = { id, value };
    let items = getLocalStorage();
    items.push(movie);
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value)
        })
        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
        const element = document.createElement('article');
        // add class
        element.classList.add("movie-item");
        // add ID
        const attribute = document.createAttribute('data-id');
        attribute.value = id;
        element.setAttributeNode(attribute);
        element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`
        const deleteBtn = element.querySelector(".delete-btn")
        const editBtn = element.querySelector(".edit-btn");
        deleteBtn.addEventListener("click", deleteItem)
        editBtn.addEventListener("click", editItem)
        // append child
        list.appendChild(element);
}