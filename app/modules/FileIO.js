/**
 * Backend Modules
 *
 *
 */
const fs = require('fs');
const { BrowserWindow, dialog } = require('electron').remote;

const FileIO = function () {
    this.fileOpen = () => {
        const win = BrowserWindow.getFocusedWindow();
        dialog.showOpenDialog(
            win,
            {
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Document',
                        extensions: ['mmm']
                    }
                ]
            },
            filePaths => {
                if (filePaths) {
                    this.readFile(filePaths[0]); //複数選択の可能性もあるので配列となる。
                }
            }
        );
    };

    this.readFile = filePath => {
        fs.readFile(filePath, (error, data) => {
            if (error !== null) {
                alert("file open error.");
                return;
            }

            // parse read file.
            console.log(data.toString());
            const json = JSON.parse(data.toString());
            this.findFields(json);
        })
    };

    this.findFields = json => {
        const projectPath = json.filePath;
        const _this = this;

        fs.readdir(projectPath, function (err, files) {
            if (err) throw err;

            files.forEach(file => {
                if (file.includes('memo')) {
                    _this.embedToField(`${projectPath}/${file}`, document.querySelector('#memo-md-field'));
                }

                if (file.includes('note')) {
                    _this.embedToField(`${projectPath}/${file}`, document.querySelector('#note-md-field'));
                }

                if (file.includes('todo')) {
                    _this.embedToField(`${projectPath}/${file}`, document.querySelector('#todo-md-field'));
                }
            });
        });
    };

    this.embedToField = (fileName, dom) => {
        fs.readFile(fileName, (error, data) => {
            if (error !== null) {
                alert("file open error.");
                return;
            }

            // insert text.
            dom.value = data.toString();
        })
    }
};

module.exports = FileIO;
