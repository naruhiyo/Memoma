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

// ElectronのMenuの設定
const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'save', click: fileCreator.saveProject()
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

    // // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    // dialog.showSaveDialog((fileName) => {
    //     if (fileName === undefined) {
    //         console.log("You didn't save the file");
    //         return;
    //     }

    //     // fileName is a string that contains the path and filename created in the save file dialog.  
    //     fs.writeFile(fileName, content, (err) => {
    //         if (err) {
    //             dialog.showErrorBox("An error ocurred creating the file", err.message);
    //         }
    //     });
    // });



    const menu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menu);

    //ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});



