/**
 * Backend Modules
 *
 * The Controller of markdown saver
 *
 * === Functions ===
 * - Save markdown files.
 */
// libraries

let ipc = require('electron').ipcRenderer;

ipc.on('onSaveProject', () => {
    let contentMemo = document.querySelector('#memo-md-field').value;
    let contentNote = document.querySelector('#note-md-field').value;
    let contentToDo = document.querySelector('#todo-md-field').value;

    let projectName = document.getElementById('project-name').dataset.projectName;

    const data = {
        memo: contentMemo,
        note: contentNote,
        todo: contentToDo,
        projectName: projectName
    };

    ipc.send('onSendProjectData', data);
});

