// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const fork = require('child_process').fork;
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let serverPickerWindow;
let serverCreatePickerWindow;
let loadingWindow;
let serverProcess;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 909,
    minWidth: 960,
    minHeight: 909,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    loadingWindow = null;
    serverPickerWindow = null;
    serverCreatePickerWindow = null;
  })
}

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  loadingWindow.setResizable(false);

  loadingWindow.loadFile("loading.html");
  
  loadingWindow.on('ready-to-show', () => {
    loadingWindow.show();
  });

  createWindow();
  
  mainWindow.on('ready-to-show', () => {
    loadingWindow.focus();
    BrowserWindow.getFocusedWindow().webContents.send('ready');
    setTimeout(() => {
      loadingWindow.hide();
      mainWindow.show();
    }, 1000);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoadingWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') app.quit()
  app.exit();
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if(mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("openServerWindow", () => {
  serverPickerWindow = new BrowserWindow({
    width: 400,
    height: 300,
    minWidth: 250,
    minHeight: 300,
    frame: false,
    show: false,
    resizable: false,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  });

  serverPickerWindow.setResizable(false);

  serverPickerWindow.loadFile("serverWindow.html");

  serverPickerWindow.on('ready-to-show', () => {
    serverPickerWindow.show();
  });
});

ipcMain.on("openServerCreateWindow", () => {
  serverCreatePickerWindow = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    show: false,
    resizable: false,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  });

  serverCreatePickerWindow.loadFile("serverCreateWindow.html");

  serverCreatePickerWindow.on('ready-to-show', () => {
    serverCreatePickerWindow.show();
  });
});

ipcMain.on("SERVERCODE", (event, data) => {
  mainWindow.webContents.send("SERVERCONNECTCODE", data);
});

ipcMain.on("SERVERUSERNAME", (event, data) => {
  mainWindow.webContents.send("SERVERUSERNAME", data);
  serverPickerWindow.hide();
});

ipcMain.on('createServer', (event, data) => {
  console.log("CREATING SERVER BY " + data);
  serverProcess = fork("./server.js", [], {});
});

