'use strict';

const saveBtn = document.getElementById('save_btn');

saveBtn.addEventListener('click', function () {
    ipc.send('onCreateProjectName', document.getElementById('projectName_txtbox').value);
    document.getElementById('project-saver').classList.toggle('d-none');
});

ipc.on('onProjectNameInfill', () => {
    document.getElementById('project-saver').classList.toggle('d-none');
});