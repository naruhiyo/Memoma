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
                    let contentProjct = projectPath;
                    fs.writeFile(projectFile, contentProjct, (errCreateProject) => {
                        if (errCreateProject) {
                            dialog.showErrorBox("An error ocurred creating the file", errCreateProject.message);
                        }
                    });

                    // .mdファイルの作成
                    // let fnameTails = ['memo', 'note', 'todo'];
                    // fnameTails.forEach(function (fnameTailsElment) {
                    //     fs.writeFile(_mdDir + '/' + projectName + '_' + fnameTailsElment + '.md', (errCreateFile) => {
                    //         if (errCreateFile) {
                    //             dialog.showErrorBox("An error ocurred creating the file", errCreateFile.message);
                    //         }
                    //     });
                    // });
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
     * レンダラープロセス内のmdテキストデータを取得して
     * 所望の.mdに上書き保存する．
     */
    saveProject() {
        // レンダラープロセスからmdテキストデータを取得する
        let mdObject = [
            {
                type: 'memo',
                content: 'hoge' //取得したデータここに書く
            },
            {
                type: 'note',
                content: 'fuga'//取得したデータここに書く
            },
            {
                type: 'todo',
                content: 'piyo'//取得したデータここに書く
            }
        ];

        let _mdDir = this.mdDir;
        let _projectName = this.projectName;
        mdObject.forEach(function (mdObj) {
            fs.writeFile(_mdDir + '/' + _projectName + '_' + mdObj.type + '.md', mdObj.content, function (errCreateFile) {
                if (errCreateFile) {
                    dialog.showErrorBox("An error ocurred creating the file", errCreateFile.message);
                }
            });
        });

    }
};
module.exports = projectManager;