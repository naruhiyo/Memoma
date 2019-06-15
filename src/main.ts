/**
 * ## Description
 * Main process.
 * 
 * ## Functions
 * - Open window.
 * - Close window.
 * - Manage menu controll.
 */

/**
 * Import modules
 */
import { app, BrowserWindow, Menu, shell, ipcMain, dialog } from 'electron';
import { ProjectManager } from './app/modules/ProjectManager.js';
import { Memoma } from "./app/modules/models/Memoma";

/**
 * Create and save project
 */
const projectManager = new ProjectManager();

/**
 * Create and control browser windows
 */
let mainWindow: Electron.BrowserWindow | null;

app.on('ready', () => {
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

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

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
                    accelerator: 'CmdOrCtrl+N',
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
                // {
                //     role: 'toggledevtools',
                // },
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

    ipcMain.on('onCreateProjectName', async (event: Electron.Event, projectNameDataset: { name: string, path: string }) => {
        event.sender.send('actionReply', projectNameDataset.name);
        projectManager.createProject(projectNameDataset.name, projectNameDataset.path);
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

        const projectPath: string = await dialog.showOpenDialog(projectPathSaveOption)!.toString();

        if (projectPath !== undefined) {
            mainWindow!.webContents.send('onProjectNameInfill', projectPath);
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
