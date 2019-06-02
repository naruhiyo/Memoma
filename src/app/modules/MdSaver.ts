/**
 * # Backend Modules
 *
 * ### The Controller of markdown saver
 *
 * === Functions ===
 *
 * - Save markdown files.
 */
import { Memoma } from './models/Memoma';
const ipc = require('electron').ipcRenderer;

ipc.on(
    'onSaveProject',
    (): void => {
        const memoMdField: HTMLInputElement = document.querySelector(
            '#memo-md-field'
        ) as HTMLInputElement;

        const noteMdField: HTMLInputElement = document.querySelector(
            '#note-md-field'
        ) as HTMLInputElement;

        const todoMdField: HTMLInputElement = document.querySelector(
            '#todo-md-field'
        ) as HTMLInputElement;

        const projectName: HTMLElement = document.querySelector(
            '#project-name'
        ) as HTMLElement;

        const name: string = projectName.dataset.projectName!;
        const path: string = projectName.dataset.projectPath!;

        const memomaData: Memoma = {
            memo: memoMdField.value,
            note: noteMdField.value,
            todo: todoMdField.value,
            projectName: name,
            projectPath: path
        };

        ipc.send('onSendProjectData', memomaData);
    }
);
