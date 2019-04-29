/**
 * Backend Modules
 *
 * The Controller of markdown editor
 *
 * === Functions ===
 * - Convert the markdown text to the html text.
 * - Toggle editor view.
 */
// libraries
const marked = require('marked');

const MdEditor = function (document) {

    // dom elements
    this.boxes = null;

    this.activeMarkdown = null;
    this.activePreview = null;
    this.activeHeader = null;

    this.maxItemSize = 0;
    this.currentNodeIndex = 0;

    this.document = document;

    // marked options
    this.markedOptions = {};

    this.init = () => {
        // get All fields
        this.boxes = this.document.querySelectorAll('.box');

        // get Active field
        this.activeMarkdown = this.document.querySelector('.markdown-text.active');
        this.activePreview = this.document.querySelector('.markdown-preview.active');
        this.activeHeader = this.document.querySelector('.box-header.active');

        this.maxItemSize = this.boxes.length;
    };

    //
    this.convert = () => {
        const text = this.activeMarkdown.value;

        // translated!
        console.warn(marked(text, this.markedOptions));
        this.activePreview.innerHTML = marked(text, this.markedOptions);
    };

    this.toggle = () => {
        this.convert();

        this.activeMarkdown.classList.toggle('d-hidden');
        this.activePreview.classList.toggle('d-hidden');
    };

    this.change = () => {
        const index = this.activeMarkdown.dataset.index;

        // update current field index
        this.currentNodeIndex = (index < this.maxItemSize) ? index : 0;

        // remove active class from current target dom.
        this.activeMarkdown.classList.remove('active');
        this.activePreview.classList.remove('active');
        this.activeHeader.classList.remove('active');

        this.activeMarkdown.setAttribute('readonly', true);

        // add active class to new target dom.
        this.activeMarkdown = this.boxes[this.currentNodeIndex].querySelector('.markdown-text');
        this.activePreview = this.boxes[this.currentNodeIndex].querySelector('.markdown-preview');
        this.activeHeader = this.boxes[this.currentNodeIndex].querySelector('.box-header');

        this.activeMarkdown.classList.add('active');
        this.activePreview.classList.add('active');
        this.activeHeader.classList.add('active');

        this.activeMarkdown.removeAttribute('readonly');
    };
};

module.exports = MdEditor;
