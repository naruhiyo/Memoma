'use strict';

import { ipcRenderer } from 'electron';
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save_btn');

if (saveBtn !== null) {
    saveBtn.addEventListener('click', function () {
        let projectNameTxtBox: HTMLInputElement = <HTMLInputElement>document.getElementById('projectName_txtbox');
        let projectSaver: HTMLElement = <HTMLElement>document.getElementById('project-saver');
        let projectName: HTMLElement = <HTMLElement>document.getElementById('project-name');

        if ((projectNameTxtBox === null) ||
            (projectSaver === null) ||
            (projectName === null)) return;

        ipcRenderer.send('onCreateProjectName', projectNameTxtBox.value);

        projectSaver.classList.toggle('d-none');
        projectName.dataset.projectName = projectNameTxtBox.value;

        ipcRenderer.on('onProjectNameInfill', () => {
            projectSaver.classList.toggle('d-none');
        });
    });


}
