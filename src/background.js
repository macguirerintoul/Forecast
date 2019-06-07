'use strict'
const { app, protocol, BrowserWindow, Menu } = require("electron");
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 600,
    titleBarStyle: 'hiddenInset',
    minWidth: 330
  });

  // Set up menu
  const template = [
    /*


    {
      label: 'File',
      submenu: [
        {
          label: 'Import Image',
          click: () => { win.webContents.send('import', 'Import Image') }
        },
        { type: 'separator' },
        {
          label: 'Export Preset',
          click: () => { win.webContents.send('exportPreset', 'Export Preset') }
        },
        { type: 'separator' },
        // {
        //   label: 'Export Effects Rack',
        //   click: () => { win.webContents.send('exportEffects', 'Export Effects') }
        // },
        {
          label: 'Export Image',
          click: () => { win.webContents.send('export', 'Export Image') }
        }
      ]
    },
    */
    // Edit
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          id: 'undo',
          accelerator: 'CmdOrCtrl+Z',
          // role: 'undo',
          click: () => { win.webContents.send('undo', 'Undo') }
        },
        {
          label: 'Redo',
          id: 'redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          // role: 'redo',
          click: () => { win.webContents.send('redo', 'Redo') }
        },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        // { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        // { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Add Effect',
          accelerator: 'CmdOrCtrl+Plus',
          type: 'radio',
          id: 'addEffect',
          click: () => { win.webContents.send('changeView', 'addEffect') }
        },
        {
          label: 'Edit Effect',
          accelerator: 'CmdOrCtrl+E',
          type: 'radio',
          id: 'editEffect',
          click: () => { win.webContents.send('changeView', 'editEffect') }
        },
        {
          label: 'History',
          accelerator: 'CmdOrCtrl+Y',
          type: 'radio',
          id: 'history',
          click: () => { win.webContents.send('changeView', 'history') }
        },
        {
          label: 'None',
          accelerator: 'Escape',
          type: 'radio',
          checked: true,
          id: 'none',
          click: () => { win.webContents.send('changeView', 'none') }
        },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Development',
      visible: isDevelopment,
      submenu: [
        {
          label: '🦄 4 Developer Eyes Only',
          enabled: false
        },
        { type: 'separator' },
        // { type: 'separator' },
        // { role: 'resetzoom' },
        // { role: 'zoomin' },
        // { role: 'zoomout' },
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        {
          label: 'View Github Repo',
          click() { require('electron').shell.openExternal('https://github.com/stuible/Image-Snafu') }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'View Documentation',
          click() { require('electron').shell.openExternal('https://github.com/stuible/Image-Snafu') }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[2].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // uncomment the following line to open dev tools automatically on launch
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
