const Titlebar = require('custom-electron-titlebar');
const { Menu, MenuItem } = require('electron').remote;
const { ipcRenderer } = require('electron')

var titlebar = new Titlebar.Titlebar({
    backgroundColor: Titlebar.Color.fromHex("#263859"),
    titleHorizontalAlignment: "left",
    maximizable: false,
    menu: null
});