// Modules
const { openItem, makeChild } = require("./makeChild");

// DOM elements
const noItems = document.getElementById("no-items");
const items = document.getElementById("items");
const unread = document.getElementById("unread");
const read = document.getElementById("read");

exports.totalItems = [];

exports.addItemToList = (args) => {
    this.totalItems.push(args);
    makeChild(args, unread, true);
    this.toggleItemContainer();
}

exports.toggleItemContainer = (results = this.totalItems) => {
    if (results.length) {
        noItems.style.display = "none";
        items.style.display = "block";
    }
    else {
        noItems.style.display = "block";
        items.style.display = "none";
    }
}

exports.initialization = () => {
    unread.style.display = "none";
    read.style.display = "none";

    unread.innerHTML = `<p> unread </p>`;
    read.innerHTML = `<p> Read </p>`;
}


exports.setUI = (results = this.totalItems) => {
    results.forEach(item => {
        if (item.isRead) {
            makeChild(item, read);
        }
        else {
            makeChild(item, unread);
        }
    })
}

const moveDown = (element) => {
    let newElement = element.parentElement.nextSibling;
    if (!newElement) {
        newElement = element.parentElement.parentElement.children[1];
    }
    newElement = newElement.children[0];
    newElement.classList.add("selected");
}

const moveTabElement = (parent, currentElement) => {
    if (parent.children[1].children[0]) {
        parent.children[1].children[0].classList.add("selected");
        currentElement.classList.remove("selected");
    }
}

window.addEventListener("keydown", e => {
    const element = document.querySelector(".selected");
    if (e.key === "ArrowDown") {
        moveDown(element);
        element.classList.remove("selected");
    }
    else if (e.key === "ArrowUp") {
        let newElement = element.parentElement.previousSibling;
        if (newElement.tagName != "DIV") {
            newElement = element.parentElement.parentElement.lastElementChild;
        }
        newElement = newElement.children[0];
        element.classList.remove("selected");
        newElement.classList.add("selected");
    }
    else if (e.key === "Enter") {
        openItem(element.dataset.url);
    }
    else if (e.key === "Tab") {
        const id = element.parentElement.parentElement.id;
        if (id === "unread") {
            moveTabElement(read, element);
        }
        else if (id === "read") {
            moveTabElement(unread, element);
        }
    }
});