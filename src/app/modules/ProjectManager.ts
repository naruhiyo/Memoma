/**
 * Backend Modules
 *
 *
 */
import { remote } from 'electron';
import * as fs from 'fs';
import { Memoma } from './models/Memoma';
import { ProjectField } from './models/ProjectField';

class ProjectManager {
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

            new Promise((resolve, reject) => {
                fs.mkdir(mdDir, { recursive: true }, err => {
                    if (err) reject(err.message);

                    resolve();
                });
            })
                .then(() => {
                    // create .mmm file (project file)
                    const projectField: ProjectField = {
                        projectName: `${projectName}`,
                        filePath: `${projectPath}/.memoma/${projectName}`,
                    };
                    const contentProject = JSON.stringify(projectField);

                    fs.writeFile(projectFile, contentProject, err => {
                        if (err) Promise.reject(new Error(err.message));
                    });

                    // create markdown files
                    const fileNameTails: string[] = ['memo', 'note', 'todo'];

                    fileNameTails.forEach(fileNameTail => {
                        const fileName = `${mdDir}/${projectName}_${fileNameTail}.md`;

                        fs.writeFile(fileName, '', err => {
                            if (err) Promise.reject(new Error(err.message));
                        });
                    });
                })
                .catch(errorMessage => {
                    remote.dialog.showErrorBox(
                        "'The operation doesn't work.'",
                        errorMessage
                    );
                });
        });
    }

    /**
     * Overwrite .md files.
     *     Call from onSaveProject function from main.js.
     *     project name
     * @param memomaData
     */
    saveProject(memomaData: Memoma): void {
        // markdown contents
        const mdObject: Array<{ type: string; content: string }> = [
            {
                type: 'memo',
                content: memomaData.memo,
            },
            {
                type: 'note',
                content: memomaData.note,
            },
            {
                type: 'todo',
                content: memomaData.todo,
            },
        ];

        const mdDir = `${__dirname}/../../.memoma/'${memomaData.projectName}`;
        const projectName: string = memomaData.projectName;

        // overwrite markdown files
        mdObject.forEach(mdObj => {
            const fileName = `${mdDir}/${projectName}_${mdObj.type}.md`;

            fs.writeFile(fileName, mdObj.content, err => {
                if (err) {
                    remote.dialog.showErrorBox(
                        'An error ocurred when the file saved.',
                        err.message
                    );
                }
            });
        });
    }
}

module.exports = ProjectManager;
