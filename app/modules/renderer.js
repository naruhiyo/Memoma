const { ipcRenderer } = require('electron');
const mdEditor = require('./app/modules/mdEditor');
const editor = new mdEditor(document);

ipcRenderer.on('toggleMdEditor', (e, data) => {
    editor.toggle();
});
