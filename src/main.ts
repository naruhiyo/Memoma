'use strict';

// global module
import { app, BrowserWindow, Menu, shell, ipcMain, remote } from 'electron';
import { ProjectManager } from './app/modules/ProjectManager.js';
import { Memoma } from "./app/modules/models/Memoma";

const projectManager = new ProjectManager();

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow: Electron.BrowserWindow | null;

// Executed after the electron started.
app.on('ready', () => {
    let projectPath: string | undefined;

    // Main process
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
    // App exit.
    mainWindow.on('closed', () => {
        mainWindow = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // The global menu of Electron app.
    const templateMenu: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Project',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => onOpenProject(),
                },
                {
                    label: 'Create New Project',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => onCreateNewProjectPreparation(),
                },
                {
                    label: 'Save Project',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => onSaveProject(),
                },
            ],
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
                {
                    role: 'toggledevtools',
                },
            ],
        },
        {
            label: 'Move',
            submenu: [
                {
                    label: 'Move to Next Tab',
                    accelerator:
                        process.platform !== 'darwin'
                            ? 'CmdOrCtrl+Tab'
                            : 'CmdOrCtrl+T',
                    click: () =>
                        mainWindow!.webContents.send('changeMdEditor', {
                            target: 'next',
                        }),
                },
            ],
        },
        {
            label: 'Move Back',
            submenu: [
                {
                    label: 'Back to Prev Tab',
                    accelerator:
                        process.platform !== 'darwin'
                            ? 'CmdOrCtrl+Shift+Tab'
                            : 'CmdOrCtrl+Shift+T',
                    click: () =>
                        mainWindow!.webContents.send('changeMdEditor', {
                            target: 'prev',
                        }),
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Preview/Edit',
                    accelerator: 'CmdOrCtrl+P',
                    click: () =>
                        mainWindow!.webContents.send('toggleMdEditor', {}),
                },
            ],
        },
    ];

    const menu: Electron.Menu = Menu.buildFromTemplate(templateMenu);

    Menu.setApplicationMenu(menu);

    ipcMain.on('onCreateProjectName', async (event: Electron.Event, projectName: string) => {
        event.sender.send('actionReply', projectName);
        if (projectPath !== undefined) {
            await projectManager.setProject(projectName, projectPath);
            projectManager.createProject();
        }
    });

    ipcMain.on('onSaveFromBtn', () => onSaveProject());


    /**
     * [Menu]->[File]->[CreateNewProject]を押した際にrenderer processへ
     *     イベントを発火させる．
     */
    async function onCreateNewProjectPreparation() {
        const projectPathSaveOption: Electron.OpenDialogOptions = {
            properties: ['openDirectory'],
        };

        projectPath = await remote.dialog.showOpenDialog(projectPathSaveOption)!.toString();

        if (projectPath !== undefined) {
            mainWindow!.webContents.send('onProjectNameInfill');
        }
    }

    /**
     * [Menu]->[File]->[SaveProject]を押した際にプロジェクトを上書き保存する．
     * 具体的には、{{ :Project-Name }}_memo.md, {{ :Project-Name }}_note.md,
     * {{ :Project-Name }}_todo.mdの3ファイルを上書き保存する．
     */
    async function onSaveProject() {
        await mainWindow!.webContents.send('onSaveProject');
        ipcMain.on('onSendProjectData', (event: Electron.Event, memoma: Memoma) => {
            projectManager.saveProject(memoma);
        });
    }

    async function onOpenProject() {
        await mainWindow!.webContents.send('onOpenProject');
    }

});
