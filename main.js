'use strict';

// アプリケーションをコントロールするモジュール
let electron = require('electron');
let app = electron.app;
let Menu = electron.Menu;
let BrowserWindow = electron.BrowserWindow;

const ProjectManager = require('./app/modules/projectManager.js');
const projectManager = new ProjectManager(__dirname);

let remote = require('electron').remote;
const { dialog } = require('electron');

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

let projectName;
let projectPath;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on('ready', function () {
    // メイン画面の表示
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

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
    let ipc = require('electron').ipcMain;

    ipc.on('onCreateProjectName', function (event, data) {
        event.sender.send('actionReply', data);
        projectName = data;
        projectManager.createProject(projectName, projectPath);
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
        projectManager.saveProject();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});



