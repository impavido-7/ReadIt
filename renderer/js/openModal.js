const { ipcRenderer } = require("electron");

// Import Renderer
const { sendItem, showInValidDialog } = require("./ipcRenderer");
const { addItemToList } = require("./items");

// DOM Elements
const showModal = document.getElementById('show-modal');
const modal = document.getElementById('modal');
const url = document.getElementById("url");
const closeModal = document.getElementById('close-modal');
const addItem = document.getElementById('add-item');

// Check for valid URL
const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

// Disable & Enable modal buttons
const toggleModalButtons = () => {
    // Check state of buttons
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

// Open Modal
showModal.addEventListener("click", e => {
    url.focus();
    modal.style.display = "flex";
});

// Close Modal
closeModal.addEventListener("click", e => {
    modal.style.display = "none";
});

// Add item
addItem.addEventListener("click", e => {
    if (validURL(url.value)) {
        sendItem(url.value, toggleModalButtons);
        toggleModalButtons();
    }
    else {
        showInValidDialog("Enter a valid URL");
    }
});

url.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addItem.click();
    }
});

ipcRenderer.on("new-item-success", (e, args) => {
    // Enable buttons
    toggleModalButtons();

    // Hide modal and clear value
    modal.style.display = 'none'
    url.value = ''

    addItemToList(args);

})