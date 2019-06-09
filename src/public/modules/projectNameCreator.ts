/**
 * ## Description
 * Client Side Modules.
 * Create project name.
 *
 * ## Functions
 * - Toggle project-save form whne receiving `onProjectNameInFill` event from `main.ts` or clicking save button.
 * - Get project name from text box when clicking save button.
 * - Send project name to `main.ts`.
 */

/**
 * Communicate asynchronously from a renderer process in projectNameCreator to the main process
 */
const pncIpcRenderer: Electron.IpcRenderer = require('electron').ipcRenderer;

/**
 * Save button
 */
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save_btn');

/**
 * Toggle elements for project saving
 */
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
