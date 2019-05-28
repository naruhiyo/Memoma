/**
 * Backend Modules
 *
 *
 */
const fs = require('fs');
const { BrowserWindow, dialog } = require('electron').remote;

class FileIO {
    fileOpen(): void {
        const win = BrowserWindow.getFocusedWindow();
        dialog.showOpenDialog(
            win,
            {
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Document',
                        extensions: ['mmm'],
                    },
                ],
            },
            filePaths => {
                if (filePaths) {
                    this.readFile(filePaths[0]); //複数選択の可能性もあるので配列となる。
                }
            }
        );
    }

    readFile(filePath: string): void {
        fs.readFile(filePath, (error, data) => {
            if (error !== null) {
                alert('file open error.');
                return;
            }

            // parse read file.
            const json = JSON.parse(data.toString());
            this.findFields(json);
        });
    }

    findFields(json): void {
        const projectPath: string = json.filePath;
        const _this = this;

        fs.readdir(projectPath, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                if (file.includes('memo')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector('#memo-md-field')
                    );
                }

                if (file.includes('note')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector('#note-md-field')
                    );
                }

                if (file.includes('todo')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector('#todo-md-field')
                    );
                }
            });
        });

        _this.addProjectNameToField(json.projectName, document.getElementById(
            'project-name'
        ) as HTMLInputElement);
    }

    embedToField(fileName: string, dom: HTMLInputElement): void {
        fs.readFile(fileName, (error, data) => {
            if (error !== null) {
                alert('file open error.');
                return;
            }

            // insert text.
            dom.value = data.toString();
        });
    }

    addProjectNameToField(projectName: string, dom: HTMLInputElement): void {
        dom.dataset.projectName = projectName;
    }
}

module.exports = FileIO;
