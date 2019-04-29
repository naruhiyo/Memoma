/**
 * Client Side Modules.
 *
 * Control the markdown editor.
 *
 * === Functions ===
 * - Requesting any operation to `mdEditor.js`.
 * - Switch each text form.
 */
const { ipcRenderer } = require('electron');
const mdEditor = require('./app/modules/mdEditor');
const editor = new mdEditor(document);

editor.init();

ipcRenderer.on('toggleMdEditor', (e, data) => {
    editor.toggle();
});

ipcRenderer.on('changeMdEditor', (e, data) => {
    editor.change();
});
