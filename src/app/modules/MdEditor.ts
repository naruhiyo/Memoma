/**
 * ## Description
 *
 * Backend Modules
 *
 * ### Functions
 *
 * - Convert the markdown text to the html text.
 * - Toggle editor view.
 */

/**
 * A dependent module from `[marked](https://github.com/markedjs/marked)`.
 */
const marked = require('marked');

/**
 * A markdown data management controller
 */
class MdEditor {
    /**
     * Document Object Model List
     */
    private readonly boxes: NodeListOf<HTMLElement> | null = null;
    /**
     * Markdown areas document object model
     */
    private activeMarkdown: HTMLInputElement | null = null;
    /**
     * Previews document object model
     */
    private activePreview: HTMLElement | null = null;
    /**
     * A tab document object model
     */
    private activeHeader: HTMLElement | null = null;

    /**
     * A maximum used size
     */
    private readonly maxItemSize: number = 0;

    /**
     * Current item position
     */
    private currentNodeIndex = 0;

    /**
     * Options for using `marked`
     */
    private markedOptions: object = {};

    /**
     * Constructor
     * @param document the `index.html`
     */
    constructor(document: HTMLElement) {
        if (document == null) {
            alert('The HTML Element does not find.');
            return;
        }

        // get All fields
        this.boxes = document.querySelectorAll('.box');

        // get Active field
        this.activeMarkdown = document.querySelector('.markdown-text.active');
        this.activePreview = document.querySelector('.markdown-preview.active');
        this.activeHeader = document.querySelector('.box-header.active');

        this.maxItemSize = this.boxes.length;
    }

    /**
     * Toggle input form and preview.
     * @return
     */
    toggle(): void {
        if (this.activeMarkdown == null || this.activePreview == null) {
            return;
        }

        this.convert();
        this.activeMarkdown.classList.toggle('d-none');
        this.activePreview.classList.toggle('d-none');
    }

    /**
     * Move next tab area
     * @param target the target position
     * @return
     */
    move(target = 'next'): void {
        if (
            this.activeMarkdown == null ||
            this.activePreview == null ||
            this.activeHeader == null ||
            this.boxes == null
        ) {
            return;
        }

        const index: number = Number(this.activeMarkdown.dataset.index);

        // update current field index
        if (target === 'next') {
            this.currentNodeIndex = index < this.maxItemSize ? index : 0;
        } else {
            this.currentNodeIndex =
                index > 1 ? index - 2 : this.maxItemSize - 1;
        }

        // remove active class from current target dom.
        this.activeMarkdown.classList.remove('active');
        this.activePreview.classList.remove('active');
        this.activeHeader.classList.remove('active');

        this.activeMarkdown.setAttribute('readonly', 'true');

        // add active class to new target dom.
        this.activeMarkdown = this.boxes[this.currentNodeIndex].querySelector(
            '.markdown-text'
        );
        this.activePreview = this.boxes[this.currentNodeIndex].querySelector(
            '.markdown-preview'
        );
        this.activeHeader = this.boxes[this.currentNodeIndex].querySelector(
            '.box-header'
        );

        if (
            this.activeMarkdown == null ||
            this.activePreview == null ||
            this.activeHeader == null
        ) {
            return;
        }

        this.activeMarkdown.classList.add('active');
        this.activePreview.classList.add('active');
        this.activeHeader.classList.add('active');

        // focus to new markdown editor
        this.activeMarkdown.focus();

        this.activeMarkdown.removeAttribute('readonly');
    }

    /**
     * Translate the markdown text to HTML.
     * @return
     */
    private convert(): void {
        if (this.activeMarkdown == null) {
            alert('The markdown form does not exist.');
            return;
        }

        const text: string = this.activeMarkdown.value;

        // translated!
        if (this.activePreview != null) {
            this.activePreview.innerHTML = marked(text, this.markedOptions);
        }
    }
}

module.exports = MdEditor;
