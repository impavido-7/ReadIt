// Modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const windowStateKeeper = require('electron-window-state');

const fs = require("fs");
const path = require("path");

const readItem = require('./getTitleAndScreenshot');
const appMenu = require('./menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// creating the data.json file, if the file doesn't exist
const pathToUserData = app.getPath("userData");
const relPath = path.join(pathToUserData, "data.json");
if (!fs.existsSync(relPath)) {
    const array = [];
    fs.writeFileSync(relPath, JSON.stringify(array));
}

// Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
    // Get new item and send back to renderer
    readItem(itemUrl, relPath, item => {
        e.sender.send('new-item-success', item)
    })
});

ipcMain.on("show-invalid-url", (e, args) => {
    dialog.showErrorBox("Error", args);
});

ipcMain.on("make-item-read", (e, args) => {
    const fileData = fs.readFileSync(relPath, "utf-8");
    const parsedData = JSON.parse(fileData);

    const data = parsedData.filter(item => !item.isRead);
    const id = data[args - 1].id;

    for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === id) {
            parsedData[i].isRead = true;
            break;
        }
    }

    e.sender.send("send-data", JSON.stringify(parsedData));
    fs.writeFileSync(relPath, JSON.stringify(parsedData));
});

const sendData = () => {
    const data = fs.readFileSync(relPath, "utf-8");
    mainWindow.webContents.send("send-data", data);
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {

    // Win state keeper
    let state = windowStateKeeper({
        defaultWidth: 500,
        defaultHeight: 650
    })

    mainWindow = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 300,
        icon: path.join(__dirname, "icon", "icon.png"),
        webPreferences: {
            // --- !! IMPORTANT !! ---
            // Disable 'contextIsolation' to allow 'nodeIntegration'
            // 'contextIsolation' defaults to "true" as from Electron v12
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    // Set the window to not re-size
    mainWindow.setResizable(false);

    // Create main app menu
    appMenu(mainWindow.webContents)

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('renderer/index.html');

    // Manage new window state
    state.manage(mainWindow);

    mainWindow.webContents.on("did-finish-load", e => {
        sendData();
    });

    // Open DevTools - Remove for PRODUCTION!
    // mainWindow.webContents.openDevTools();

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
