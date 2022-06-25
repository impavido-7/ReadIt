const { Menu } = require('electron')

// Module function to create main app menu
module.exports = appWin => {

    // Menu template
    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        appWin.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item')
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Search Items',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        appWin.send('menu-focus-search')
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        }
    ]

    // Create Mac app menu
    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' })

    // Build menu
    let menu = Menu.buildFromTemplate(template)

    // Set as main app menu
    Menu.setApplicationMenu(menu)
}
