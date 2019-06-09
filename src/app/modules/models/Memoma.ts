/**
 * An entity of Memo
 */
export interface Memoma {
    /**
     * An area to summarize the anything.
     */
    memo: string;
    /**
     * An area which can write what you think.
     */
    note: string;
    /**
     * A `Todo` list that you need.
     */
    todo: string;
    /**
     * A project name.
     */
    projectName: string;
    /**
     * A path of placed the project.
     */
    projectPath: string;
}
