'use strict';

let remote = require('electron').remote;
const { dialog } = require('electron');
let fs = require('fs');

const FileCreator = class {
    constructor(dirName) {
        this.dirName = dirName;
    }

    saveProject(projectName) {
        let content = "Some text to save into the file";

        let pdir = this.dirName + '/' + projectName;

        let fnameTails = ['memo', 'note', 'todo'];
        fs.access(pdir, (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    fs.mkdir(pdir);

                    fnameTails.forEach(function (fnameTailsElment) {
                        fs.writeFile(pdir + '/' + projectName + '_' + fnameTailsElment + '.md', content, (errCreateFile) => {
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