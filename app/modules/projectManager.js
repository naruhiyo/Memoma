'use strict';

let remote = require('electron').remote;
const { dialog } = require('electron');
let fs = require('fs');

const projectManager = class {
    constructor(dirName) {
        this.dirName = dirName;
    }

    /**
     * プロジェクトを作成する
     * @param 
     */
    createProject(projectName, projectPath) {
        this.projectName = projectName;
        this.mdDir = this.dirName + '/.memoma/' + projectName;
        let projectFile = projectPath + '/' + projectName + '.mmm';

        let _mdDir = this.mdDir;

        fs.access(_mdDir, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.mkdir(_mdDir, (err) => {
                        if (err) {
                            console.warn(err.message);
                        }
                    });

                    // .mmmファイルの作成
                    let contentProjct = `{"projectName": "${projectName}",\n
                    "filePath": ".memoma/${projectName}"\n
                    }`;

                    fs.writeFile(projectFile, contentProjct, (errCreateProject) => {
                        if (errCreateProject) {
                            dialog.showErrorBox("An error ocurred creating the file", errCreateProject.message);
                        }
                    });

                    // .mdファイルの作成
                    let fnameTails = ['memo', 'note', 'todo'];
                    fnameTails.forEach(function (fnameTailsElment) {
                        fs.writeFile(_mdDir + '/' + projectName + '_' + fnameTailsElment + '.md', '', (errCreateFile) => {
                            if (errCreateFile) {
                                dialog.showErrorBox("An error ocurred creating the file", errCreateFile.message);
                            }
                        });
                    });

                    return;
                } else {
                    return;
                }
            }
        });
    }

    /**
     * Overwrite .md files. 
     *     Call from onSaveProject function from main.js.
     * @param {Object} data contents of markdown contents editing and 
     *     project name
     */
    saveProject(data) {
        let mdObject = [
            {
                type: 'memo',
                content: data.memo
            },
            {
                type: 'note',
                content: data.note
            },
            {
                type: 'todo',
                content: data.todo
            }
        ];

        let _mdDir = __dirname + '/../../.memoma/' + data.projectName;
        let _projectName = data.projectName;
        mdObject.forEach(function (mdObj) {
            fs.writeFile(_mdDir + '/' + _projectName + '_' + mdObj.type + '.md', mdObj.content, function (errCreateFile) {
                if (errCreateFile) {
                    dialog.showErrorBox("An error ocurred creating the file", errCreateFile.message);
                }
            });
        });

    }

    openProject() {
        fileIO.fileOpen();
    }
};
module.exports = projectManager;