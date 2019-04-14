var ipc = require('electron').ipcRenderer;
var hogeBtn = document.getElementById('save_btn');
hogeBtn.addEventListener('click', function () {
    ipc.once('actionReply', function (event, response) {
        processResponse(response);
    })
    ipc.send('invokeAction', document.getElementById('projectName_txtbox').value);
});