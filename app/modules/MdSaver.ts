/**
 * # Backend Modules
 *
 * ### The Controller of markdown saver
 *
 * === Functions ===
 *
 * - Save markdown files.
 */
// libraries

const ipc = require('electron').ipcRenderer;

ipc.on('onSaveProject', (): void => {
    const memoMdField: HTMLInputElement = document.querySelector('#memo-md-field') as HTMLInputElement;
    const memoValue: string = memoMdField.value;

    const noteMdField: HTMLInputElement = document.querySelector('#note-md-field') as HTMLInputElement;
    const noteValue: string = noteMdField.value;

    const todoMdField: HTMLInputElement = document.querySelector('#todo-md-field') as HTMLInputElement;
    const todoValue: string = todoMdField.value;

    const projectName:  HTMLInputElement = document.getElementById('project-name') as HTMLInputElement;
    const name: string = projectName.dataset.projectName;

    const data: object = {
        memo: memoValue,
        note: noteValue,
        todo: todoValue,
        projectName: name,
    };

    ipc.send('onSendProjectData', data);
});

