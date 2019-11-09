const Titlebar = require('custom-electron-titlebar');
const { Menu, MenuItem, shell } = require('electron').remote;
const { ipcRenderer } = require('electron');

var connectedToAServer = false;

var disconnectCommand = false;

var titlebar = new Titlebar.Titlebar({
    backgroundColor: Titlebar.Color.fromHex("#263859"),
    icon: "./res/aces.png",
});

var mainSubmenu = new MenuItem({
    label: "Game",
    submenu: [
        {
            label: "Connect to a server",
            click: () => ipcRenderer.send("openServerWindow")
        },
        {
            label: "Disconnect from server",
            click: () => disconnectCommand = true,
            enabled: false
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            role: "quit"
        },
    ]
});

const menu = new Menu();
menu.append(mainSubmenu);
menu.append(new MenuItem({
    label: "About",
    submenu: [
        {
            label: "Discord",
            submenu: [
                {
                    label: "The Souls",
                    click: () => {
                        shell.openExternal("https://discord.gg/9zPUjt3")
                    }
                },
                {
                    label: "Kakebiten",
                    click: () => {
                        shell.openExternal("https://discord.gg/Z47MPN8")
                    }
                }
            ]
        },
        {
            label: "How to play",
            click: () => {
                shell.openExternal("https://www.palapoker.com/texas-holdem/");
            }
        }
    ]
}));

titlebar.updateMenu(menu);

setInterval(() => {
    if(connectedToAServer) {
        mainSubmenu.submenu.items[0].enabled = false;
        mainSubmenu.submenu.items[1].enabled = true;
    } else {
        mainSubmenu.submenu.items[0].enabled = true;
        mainSubmenu.submenu.items[1].enabled = false;
    }
}, 1);