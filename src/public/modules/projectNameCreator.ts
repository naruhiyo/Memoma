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
    saveBtn.addEventListener('click', () => {
        const projectNameTxtBox: HTMLInputElement = <HTMLInputElement>document.getElementById('projectName_txtbox');
        const projectName: HTMLElement = <HTMLElement>document.getElementById('project-name');

        if ((projectNameTxtBox === null) ||
            (projectSaver === null) ||
            (projectName === null)) return;


        projectSaver.classList.toggle('d-none');

        /**
         * TODO: ここで必ず path に projectName を追加する
         */
        const name: string = projectNameTxtBox.value;
        const path: string = projectName.dataset.projectPath!;

        projectName.dataset.projectName = name;
        projectName.dataset.projectPath = `${path}/.memoma/${name}`;

        pncIpcRenderer.send('onCreateProjectName', { name: name, path: path });
    });
}

pncIpcRenderer.on('onProjectNameInfill', (event: Electron.Event, projectPath: string) => {
    const projectName: HTMLElement = <HTMLElement>document.getElementById('project-name');
    projectName.dataset.projectPath = `${projectPath}`;

    projectSaver.classList.toggle('d-none');
});
