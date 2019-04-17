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
                    label: 'save', click: fileCreator.saveProject(projectName)
                    // レンダラーにhiddenなくしてっていう
                }
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
                    click(item, focusedWindow) {
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

    ipc.on('invokeAction', function (event, data) {
        event.sender.send('actionReply', data);
        projectName = data;
        console.log(data);
    });






    //ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});



