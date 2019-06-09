# Memoma

A simple memo app.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

[![Lang: NodeJS](https://img.shields.io/badge/Lang-NodeJS_11.x-blue.svg)]()
[![Lang: TypeScript](https://img.shields.io/badge/Lang-TypeScript%203.4.x-blue.svg)]()

[![FrameWork: Electron](https://img.shields.io/badge/FrameWork-Electron_5.x-teal.svg)]()

[![DocStyle: TypeDoc](https://img.shields.io/badge/DocStyle-TypeDoc%200.14.x-blueviolet.svg)]()
[![CodeStyle: gts](https://img.shields.io/badge/CodeStyle-gts%201.x-blueviolet.svg)]()

## What's about?

A memo-app that can write `markdown`, and this app is made by electron.

## Demo
![demo](https://github.com/narugit/Memoma/blob/master/docs/assets/images/demos.gif)

## Installation

### Introduction

```bash
# copy to local
$ git clone https://github.com/narugit/Memoma.git

# package install
$ npm install # npm i
```

### Dev

```bash
$ npm run dev
```

### Build

#### compile

This sources is made by `typescript`, so you have to compile the files.

We use `gts` to compile them and you can use this.

```bash
$ npm run compile
```

And then, you must move the compiled files to `src/`, because the files create in `build/`.

Below command is a shell script that can move to `src/` automatically.

```bash
$ npm run movejs
# or you can use this one
$ ./jt.sh
```

### deploy

```bash
# For Windows
$ npm run build:win

# For Mac
$ npm run build:win
```

### code lint

```bash
$ npm run check [:your_target_file] # you can select the file to check statements.
```

## How To
1. Create new project or open a project.
1. Edit file.
1. Save the project.

### Create New Project
1. Select `File`->`Create New Project` or `Ctrl + n`.
1. Select the directory which you want to create new project.
1. Input a project name.
1. Click `save` button.

### Edit File
- Move to next tab: `Ctrl + Tab`
- Move to prev tab: `Ctrl + Shift + Tab`
- Toggle Preview/Edit: `Ctrl + p`

### Save the Project
1. Select `File`->`Save Project` or `Ctrl + s`.

## Documentation
Here is [the documentation](https://narugit.github.io/Memoma
) by generating [TypeDoc](https://typedoc.org/).

## Directory

```
/
├ docs                      # documentation
│   └ requirement           # system requirement document
├ src                       
│   ├ app
│   │   └ modules           # core modules
│   ├ public
│   │   └ modules           # front modules
│   ├ index.html
│   ├ main.ts
│   └ style.css
├ build-mac.js              # build config for Mac
├ build-win.js              # build config for Windows
├ jt.sh                     # automation scripts
└ README.md                       
```

## Contributor

- [narugit](https://github.com/narugit)

- [hiyoko3](https://github.com/hiyoko3)

## License

[MIT](https://github.com/narugit/Memoma/blob/master/LICENSE)
