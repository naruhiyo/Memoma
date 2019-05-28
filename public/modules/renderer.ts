/**
 * Client Side Modules.
 *
 * Control the markdown editor.
 *
 * === Functions ===
 * - Requesting any operation to `MdEditor.js`.
 * - Switch each text form.
 */
const { ipcRenderer } = require('electron');

const mdEditor = require('./app/modules/MdEditor');
const fileIO = require('./app/modules/FileIO');

const editor = new mdEditor(document);
const fIO = new fileIO();

document.addEventListener('DOMContentLoaded', async () => {
    await editor.init();

    const modalWindow = document.querySelector('#project-saver.modal');

    const modalCloseBtn = document.querySelector('#modal-close');
    const saveBtn = document.querySelector('#save-btn i');
    const toggleBtn = document.querySelector('#toggle-btn i');
    const changeBtn = document.querySelector('#change-btn i');

    ipcRenderer.on('toggleMdEditor', (e, data) => {
        editor.toggle();
    });

    ipcRenderer.on('changeMdEditor', (e, data) => {
        editor.move(data.target);
    });

    ipcRenderer.on('toggleModalDialog', (e, data) => {
        modalWindow.classList.toggle('d-none');
    });

    modalCloseBtn.addEventListener('click', () => {
        modalWindow.classList.toggle('d-none');
    });

    ipcRenderer.on('onOpenProject', (e, data) => {
        fIO.fileOpen();
    });

    saveBtn.addEventListener('click', () => {
        ipcRenderer.send('onSaveFromBtn', {});
    });

    toggleBtn.addEventListener('click', () => {
        editor.toggle();
    });

    changeBtn.addEventListener('click', () => {
        editor.move('next');
    });
});
