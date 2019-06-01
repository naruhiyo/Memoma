'use strict';

const { dialog } = require('electron');
const fs = require('fs');

const projectManager = class {
    /**
     * Create new project.
     * @param {string} projectName name of project which the user input #projectName_txtbox
     * @param {string} projectPath path to project
     */
    createProject(projectName: string, projectPath: string): void {
        const mdDir = `${projectPath}/.memoma/${projectName}`;
        const projectFile = `${projectPath}/${projectName}.mmm`;

        fs.access(mdDir, err => {
            if (!err) return;
            // create files if the markdown directory does not exist
            if (err.code !== 'ENOENT') return;

            new Promise(resolve => {
                fs.mkdir(mdDir, { recursive: true }, err => {
                    if (err) {
                        dialog.showErrorBox(err.message);
                    }
                    resolve();
                });
            }).then(() => {
                // create .mmm file (project file)
                const contentProjct = `{"projectName": "${projectName}",\n"filePath": "${projectPath}/.memoma/${projectName}"\n}`;

                fs.writeFile(projectFile, contentProjct, errCreateProject => {
                    if (errCreateProject) {
                        dialog.showErrorBox(
                            'An error ocurred creating the file',
                            errCreateProject.message
                        );
                    }
                });

                // create markdown files
                const fnameTails: string[] = ['memo', 'note', 'todo'];

                fnameTails.forEach(fnameTailsElment => {
                    const fileName = `${mdDir}/${projectName}_${fnameTailsElment}.md`;

                    fs.writeFile(fileName, '', errCreateFile => {
                        if (errCreateFile) {
                            dialog.showErrorBox(
                                'An error ocurred creating the file',
                                errCreateFile.message
                            );
                        }
                    });
                });
            });
        });
    }

    /**
     * Overwrite .md files.
     *     Call from onSaveProject function from main.js.
     * @param {Object} data contents of markdown contents editing and
     *     project name
     */
    saveProject(data): void {
        // markdown contents
        const mdObject: Array<{}> = [
            {
                type: 'memo',
                content: data.memo,
            },
            {
                type: 'note',
                content: data.note,
            },
            {
                type: 'todo',
                content: data.todo,
            },
        ];

        const mdDir = `${__dirname}/../../.memoma/'${data.projectName}`;
        const projectName: string = data.projectName;

        // overwrite markdown files
        mdObject.forEach(mdObj => {
            const fileName = `${mdDir}/${projectName}_${mdObj.type}.md`;

            fs.writeFile(fileName, mdObj.content, errCreateFile => {
                if (errCreateFile) {
                    dialog.showErrorBox(
                        'An error ocurred creating the file',
                        errCreateFile.message
                    );
                }
            });
        });
    }
};

module.exports = projectManager;
