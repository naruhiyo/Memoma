'use strict';

// global module
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const ProjectManager = require('./app/modules/ProjectManager.js');


const projectManager = new ProjectManager(__dirname);
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
let projectName;
let projectPath;

// Window closed events
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Executed after the electron started.
app.on('ready', async () => {
    // Main process
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
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

    // ElectronのMenuの設定
    const templateMenu = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Project',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => onOpenProject()
                },
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
                // For debugger
                // {
                //     role: 'toggledevtools',
                // },
            ]
        },
        {
            label: 'Move',
            submenu: [
                {
                    label: 'Move to Next Tab',
                    accelerator: process.platform !== 'darwin' ? 'CmdOrCtrl+Tab': 'CmdOrCtrl+T',
                    click: () => mainWindow.webContents.send('changeMdEditor', {
                        target: 'next'
                    })
                }
            ]
        },
        {
            label: 'Move Back',
            submenu: [
                {
                    label: 'Back to Prev Tab',
                    accelerator: process.platform !== 'darwin' ? 'CmdOrCtrl+Shift+Tab': 'CmdOrCtrl+Shift+T',
                    click: () => mainWindow.webContents.send('changeMdEditor', {
                        target: 'prev'
                    })
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Preview/Edit',
                    accelerator: 'CmdOrCtrl+P',
                    click: () => mainWindow.webContents.send('toggleMdEditor', {})
                }
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
        const promise = Promise.resolve();
        promise.then(() => {
            mainWindow.webContents.send('onSaveProject');
        }).then(() => {
            ipc.on('onSendProjectData', function (event, data) {
                projectManager.saveProject(data);
            });
        });
    }

    function onOpenProject() {
        mainWindow.webContents.send('onOpenProject');
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
