// libraries
const marked = require('marked');

const MdEditor = function (document) {

    // dom elements
    this.markdown = null;
    this.preview = null;
    this.document = document;

    // marked options
    this.markedOptions = {}

    this.init = () => {
        // dynamic doms
        this.markdown = this.document.querySelector('.markdown-text.active');
        this.preview = this.document.querySelector('.markdown-preview.active');
    };

    //
    this.translate = () => {
        this.init();

        const text = this.markdown.value;

        // translated!
        this.preview.innerHTML = marked(text, this.markedOptions);
    };

    this.toggle = () => {
        this.translate();

        this.markdown.classList.toggle('d-hidden');
        this.preview.classList.toggle('d-hidden');
    }
};

module.exports = MdEditor;
