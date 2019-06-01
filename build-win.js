'use strict';

const builder = require('electron-builder');
const fs = require('fs');
const packagejson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

builder.build({
    platform: 'win',
    config: {
        'appId': `${packagejson.name}`,
        'win': {
            'target': {
                'target': 'zip',
                'arch': [
                    'x64'
                ]
            },
            'icon': 'src/public/icon.png'
        }
    },
})
