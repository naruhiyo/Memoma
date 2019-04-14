/**
 * Control the markdown editor.
 *
 * === Functions ===
 * - Requesting any operation to `mdEditor.js`.
 * - Switch each text form.
 */
const { ipcRenderer } = require('electron');
const mdEditor = require('./app/modules/mdEditor');
const editor = new mdEditor(document);

ipcRenderer.on('toggleMdEditor', (e, data) => {
    editor.toggle();
});
