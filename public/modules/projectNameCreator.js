'use strict';

//let ipc = require('electron').ipcRenderer;
let saveBtn = document.getElementById('save_btn');

saveBtn.addEventListener('click', function () {
    ipc.send('onCreateProjectName', document.getElementById('projectName_txtbox').value);
    document.getElementById('projectSaver').hidden = true;
});

ipc.on('onProjectNameInfill', () => {
    document.getElementById('projectSaver').hidden = false;
});