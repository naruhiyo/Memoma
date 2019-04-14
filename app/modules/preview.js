// libraries
const marked = require('marked');
const log = require('electron-log');

// marked options
const markedOptions = {}

// dom elements
const p = document.querySelector('#preview-btn');

p.addEventListener('click', (e) => {
    // dynamic doms
    const currentText = document.querySelector('.markdown-text.active').value;
    const preview = document.querySelector('.markdown-preview.active');

    log.info('called!', currentText);

    // translated...
    preview.innerHTML = marked(currentText, markedOptions);
});