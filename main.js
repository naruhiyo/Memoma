'use strict';

// アプリケーションをコントロールするモジュール
let electron = require('electron');
let app = electron.app;
let Menu = electron.Menu;
let BrowserWindow = electron.BrowserWindow;

const FileCreator = require('./app/modules/fileCreator.js');
const fileCreator = new FileCreator(__dirname);

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

let projectName;

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
                    label: 'save', click: () => onSavePreparation()
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
    var ipc = require('electron').ipcMain;

    ipc.on('onCreateProjectName', function (event, data) {
        event.sender.send('actionReply', data);
        projectName = data;
        fileCreator.saveProject(projectName);
    });

    /**
     * [Menu]->[File]->[save]を押した際にrenderer processへ
     *     イベントを発火させる．
     */
    function onSavePreparation() {
        mainWindow.webContents.send('save-preparation');
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});



