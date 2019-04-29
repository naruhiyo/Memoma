'use strict';

// global module
const { app, globalShortcut, BrowserWindow } = require('electron');

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

// Window closed events
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Executed after the electron started.
app.on('ready', async () => {
    // Main process
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // App exit.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Shortcut command event
    globalShortcut.register('CommandOrControl+P', () => {
        // request to toggle editor mode.
        mainWindow.webContents.send('toggleMdEditor', {});
    })

    globalShortcut.register('CommandOrControl+T', () => {
        // request to change editor mode.
        mainWindow.webContents.send('changeMdEditor', {});
    })
});
