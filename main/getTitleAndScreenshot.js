// Modules
const { BrowserWindow } = require('electron');

const fs = require("fs");

const addItemToUserData = (relPath, data) => {
    const fileData = fs.readFileSync(relPath, "utf-8");
    const parsedData = JSON.parse(fileData);
    const newData = [data, ...parsedData];
    newData.forEach((item, i) => item.id = i + 1);
    fs.writeFileSync(relPath, JSON.stringify(newData));
}

// Offscreen BrowserWindow
let offscreenWindow;

// Exported readItem function
module.exports = (url, relPath, callback) => {

    // Create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    // Load item url
    offscreenWindow.loadURL(url)

    // Wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e => {

        // Get page title
        let title = offscreenWindow.getTitle()

        // Get screenshot (thumbnail)
        offscreenWindow.webContents.capturePage().then(image => {

            // Get image as a dataURL
            let screenshot = image.toDataURL()

            const obj = {
                title,
                screenshot,
                url,
                isRead: false
            }

            addItemToUserData(relPath, obj);

            // Execute callback with new item object
            callback({
                title,
                screenshot,
                url,
                isRead: false
            })

            // Clean up
            offscreenWindow.close()
            offscreenWindow = null

        })
    })
}
