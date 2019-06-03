/**
 * Client Side Modules.
 *
 * Control the markdown editor.
 *
 * === Functions ===
 * - Requesting any operation to `MdEditor.ts`.
 * - Switch each text form.
 */
const ipcRenderer: Electron.IpcRenderer = require('electron').ipcRenderer;

const mdEditor = require('./app/modules/MdEditor');
const FileIO = require('./app/modules/FileIO');

const editor = new mdEditor(document);
const fileIO = new FileIO();

document.addEventListener('DOMContentLoaded', async () => {
    const modalWindow = document.querySelector('#project-saver.modal');

    const modalCloseBtn = document.querySelector('#modal-close');
    const saveBtn = document.querySelector('#save-btn i');
    const toggleBtn = document.querySelector('#toggle-btn i');
    const changeBtn = document.querySelector('#change-btn i');

    ipcRenderer.on('toggleMdEditor', () => {
        editor.toggle();
    });

    ipcRenderer.on('changeMdEditor', (data: { target: string }) => {
        editor.move(data.target);
    });

    ipcRenderer.on('toggleModalDialog', () => {
        if (modalWindow === null) return;
        modalWindow.classList.toggle('d-none');
    });

    if (modalCloseBtn === null) return;
    modalCloseBtn.addEventListener('click', () => {
        if (modalWindow === null) return;
        modalWindow.classList.toggle('d-none');
    });

    ipcRenderer.on('onOpenProject', () => {
        fileIO.fileOpen();
    });

    if (saveBtn === null) return;
    saveBtn.addEventListener('click', () => {
        ipcRenderer.send('onSaveFromBtn', {});
    });

    if (toggleBtn === null) return;
    toggleBtn.addEventListener('click', () => {
        editor.toggle()
    });

    if (changeBtn === null) return;
    changeBtn.addEventListener('click', () => {
        editor.move('next')
    });
});
