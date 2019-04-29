/**
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
    this.markdowns = null;
    this.previews = null;

    this.activeMarkdown = null;
    this.activePreview = null;

    this.maxItemSize = 0;
    this.currentNodeIndex = 0;

    this.document = document;

    // marked options
    this.markedOptions = {};

    this.init = () => {
        // get All fields
        this.markdowns = this.document.querySelectorAll('.markdown-text');
        this.previews = this.document.querySelectorAll('.markdown-preview');

        // get Active field
        this.activeMarkdown = this.document.querySelector('.markdown-text.active');
        this.activePreview = this.document.querySelector('.markdown-preview.active');

        this.maxItemSize = this.markdowns.length;
    };

    //
    this.convert = () => {
        const text = this.activeMarkdown.value;

        // translated!
        this.activePreview.innerHTML = marked(text, this.markedOptions);
    };

    this.toggle = () => {
        this.convert();

        this.activeMarkdown.classList.toggle('d-hidden');
        this.activePreview.classList.toggle('d-hidden');
    };

    this.change = () => {
        const index = this.activeMarkdown.dataset.index;

        this.currentNodeIndex = (index < this.maxItemSize) ? index : 0;

        // remove active class from current target dom.
        this.activeMarkdown.classList.remove('active');
        this.activePreview.classList.remove('active');

        // add active class to new target dom.
        this.activeMarkdown = this.markdowns[this.currentNodeIndex];
        this.activePreview = this.previews[this.currentNodeIndex];

        this.activeMarkdown.classList.add('active');
        this.activePreview.classList.add('active');
    };
};

module.exports = MdEditor;
