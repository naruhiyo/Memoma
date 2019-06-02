/**
 * Backend Modules
 *
 *
 */
import * as fs from 'fs';
import { remote } from 'electron';
import { ProjectField } from './models/ProjectField';

class FileIO {
    fileOpen(): void {
        const win = remote.BrowserWindow.getFocusedWindow();

        if (win == null) return;

        remote.dialog.showOpenDialog(
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
                if (filePaths != null) {
                    this.readFile(filePaths[0]); //複数選択の可能性もあるので配列となる。
                }
            }
        );
    }

    readFile(filePath: string): void {
        fs.readFile(filePath, (error, data) => {
            if (error != null) {
                alert('file open error.');
                return;
            }

            // parse read file.
            const projectField: ProjectField = JSON.parse(data.toString());
            this.findFields(projectField);
        });
    }

    findFields(projectField: ProjectField): void {
        const projectPath: string = projectField.filePath;
        const _this = this;

        fs.readdir(projectPath, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                if (file.includes('memo')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector(
                            '#memo-md-field'
                        ) as HTMLInputElement
                    );
                }

                if (file.includes('note')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector(
                            '#note-md-field'
                        ) as HTMLInputElement
                    );
                }

                if (file.includes('todo')) {
                    _this.embedToField(
                        `${projectPath}/${file}`,
                        document.querySelector(
                            '#todo-md-field'
                        ) as HTMLInputElement
                    );
                }
            });
        });

        _this.addProjectAttributesToField(
            projectField.projectName,
            projectPath,
            document.querySelector('#project-name') as HTMLInputElement
        );
    }

    embedToField(fileName: string, dom: HTMLInputElement): void {
        fs.readFile(fileName, (error, data) => {
            if (error != null) {
                alert('file open error.');
                return;
            }

            // insert text.
            dom.value = data.toString();
        });
    }

    addProjectAttributesToField(projectName: string, projectPath: string, dom: HTMLInputElement): void {
        dom.dataset.projectName = projectName;
        dom.dataset.projectPath = projectName;
    }
}

module.exports = FileIO;
