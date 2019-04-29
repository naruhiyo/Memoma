'use strict';

// global module
const { app, globalShortcut, BrowserWindow, Menu, dialog, shell } = require('electron');
const ProjectManager = require('./app/modules/projectManager.js');


const projectManager = new ProjectManager(__dirname);
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
let projectName;
let projectPath;

// Window closed events
app.on('window-all-closed', function () {
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

    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    // App exit.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Shortcut command event
    globalShortcut.register('CommandOrControl+P', () => {
        // request to toggle editor mode.
        mainWindow.webContents.send('toggleMdEditor', {});
    });

    globalShortcut.register('CommandOrControl+T', () => {
        // request to change editor mode.
        mainWindow.webContents.send('changeMdEditor', {});
    });

    // ElectronのMenuの設定
    const templateMenu = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Create New Project',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => onCreateNewProjectPreparation()
                },
                {
                    label: 'Save Project',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => onSaveProject()
                },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    role: 'undo',
                },
                {
                    role: 'redo',
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) focusedWindow.reload()
                    },
                },
                {
                    type: 'separator',
                },
                {
                    role: 'resetzoom',
                },
                {
                    role: 'zoomin',
                },
                {
                    role: 'zoomout',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'togglefullscreen',
                },
                {
                    role: 'toggledevtools',
                },
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(templateMenu);

    Menu.setApplicationMenu(menu);

    const ipc = require('electron').ipcMain;

    ipc.on('onCreateProjectName', function (event, data) {
        event.sender.send('actionReply', data);
        projectName = data;
        projectManager.createProject(projectName, projectPath);
    });

    ipc.on('onSaveFromBtn', function (event, data) {
        onSaveProject()
    });

    /**
     * [Menu]->[File]->[CreateNewProject]を押した際にrenderer processへ
     *     イベントを発火させる．
     */
    function onCreateNewProjectPreparation() {
        let promise = Promise.resolve();
        promise.then(() => {
            let projectPathSaveOption = {
                properties: ['openDirectory']
            };

            projectPath = dialog.showOpenDialog(projectPathSaveOption);
        }).then(() => {
            if (projectPath !== undefined) {
                mainWindow.webContents.send('onProjectNameInfill');
            }
        });

    }

    /**
     * [Menu]->[File]->[SaveProject]を押した際にプロジェクトを上書き保存する．
     * 具体的には、{{ :Project-Name }}_memo.md, {{ :Project-Name }}_note.md, 
     * {{ :Project-Name }}_todo.mdの3ファイルを上書き保存する．
     */
    function onSaveProject() {
        mainWindow.webContents.send('toggleModalDialog', {});
        projectManager.saveProject();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
