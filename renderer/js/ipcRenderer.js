// Import Modules
const { ipcRenderer } = require('electron');

// Import helper functions
const items = require("./items");

exports.sendItem = (val) => {
    // Send new item url to main process
    ipcRenderer.send('new-item', val);
}

exports.showInValidDialog = (content) => {
    ipcRenderer.send("show-invalid-url", content);
}

ipcRenderer.on("send-data", (e, args) => {
    items.totalItems = JSON.parse(args);
    items.toggleItemContainer();
    items.initialization();
    items.setUI();
});
