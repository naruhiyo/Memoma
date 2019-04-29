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
const FileIO = require('./app/modules/FileIO');

const editor = new mdEditor(document);
const fileIO = new FileIO();

document.addEventListener('DOMContentLoaded', async () => {
    await fileIO.fileOpen();
    await editor.init();

    ipcRenderer.on('toggleMdEditor', (e, data) => {
        editor.toggle();
    });

    ipcRenderer.on('changeMdEditor', (e, data) => {
        editor.change();
    });
});
