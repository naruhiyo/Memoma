'use strict';

let remote = require('electron').remote;
const { dialog } = require('electron');
let fs = require('fs');

const FileCreator = class {
    constructor(dirName) {
        this.dirName = dirName;
    }

    /**
     * プロジェクトを保存する
     * @param 
     */
    saveProject(projectName, projectPath) {
        let content = "Some text to save into the file";

        let mdDir = this.dirName + '/.memoma/' + projectName;
        let projectFile = projectPath + '/' + projectName + '.mmm';

        let fnameTails = ['memo', 'note', 'todo'];
        fs.access(mdDir, (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    fs.mkdir(mdDir);

                    let contentProjct = projectPath;
                    fs.writeFile(projectFile, contentProjct, (errCreateProject) => {
                        if (errCreateProject) {
                            dialog.showErrorBox("An error ocurred creating the file", errCreateProject.message);
                        }
                    });

                    fnameTails.forEach(function (fnameTailsElment) {
                        fs.writeFile(mdDir + '/' + projectName + '_' + fnameTailsElment + '.md', content, (errCreateFile) => {
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
};
module.exports = FileCreator;