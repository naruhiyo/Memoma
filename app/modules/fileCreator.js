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

        fs.mkdir(pdir);

        fnameTails.forEach(function (fnameTailsElment) {
            fs.writeFile(pdir + '/' + projectName + '_' + fnameTailsElment + '.md', content, (err) => {
                if (err) {
                    dialog.showErrorBox("An error ocurred creating the file", err.message);
                }
            });
        });
    }
};
module.exports = FileCreator;