/**
 * ## Description
 *
 * Backend Modules
 *
 * ### Functions
 *
 * - File open and read.
 * - Set text to input area.
 * - Register project name and path to the memoma app.
 */

/**
 * Import modules
 */
import * as fs from 'fs';
import { remote } from 'electron';
import { ProjectField } from './models/ProjectField';

/**
 * A File Input/Ouput management controller
 */
class FileIO {
    /**
     * Open the target file like `***.mmm`
     * @return
     */
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

    /**
     * Read the file to find the path of `***.md` files.
     * @param filePath
     */
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

    /**
     * Find the `***.md` and call `embedToField` to write what is read.
     * @param projectField the entity that has project name and path.
     * @return
     */
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

    /**
     * Write the file content to the dom.
     * @param fileName the local md file name
     * @param dom HTML Input element such as `#***-md-filed`
     * @return
     */
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

    /**
     * Register the project name and path to this app.
     * @param projectName project name
     * @param projectPath project path
     * @param dom A dom to store the above params
     * @return
     */
    addProjectAttributesToField(projectName: string, projectPath: string, dom: HTMLInputElement): void {
        dom.dataset.projectName = projectName;
        dom.dataset.projectPath = projectName;
    }
}

module.exports = FileIO;
