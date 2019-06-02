'use strict';

import { ipcRenderer as pncIpcRenderer} from 'electron';
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save_btn');
const projectSaver: HTMLElement = <HTMLElement>document.getElementById('project-saver');

if (saveBtn !== null) {
    saveBtn.addEventListener('click', function () {
        const projectNameTxtBox: HTMLInputElement = <HTMLInputElement>document.getElementById('projectName_txtbox');
        const projectName: HTMLElement = <HTMLElement>document.getElementById('project-name');

        if ((projectNameTxtBox === null) ||
            (projectSaver === null) ||
            (projectName === null)) return;

        pncIpcRenderer.send('onCreateProjectName', projectNameTxtBox.value);

        projectSaver.classList.toggle('d-none');
        projectName.dataset.projectName = projectNameTxtBox.value;
    });
}

pncIpcRenderer.on('onProjectNameInfill', () => {
    projectSaver.classList.toggle('d-none');
});
