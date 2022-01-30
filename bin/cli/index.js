#!/usr/bin/env node

//requirements
const fs = require('fs');
const path = require('path');
const runCommant = require("swan-run-command");

//directories

const distDirectory = path.join(`${process.cwd()}`, '.dist');

const APIDirectory = path.join(`${process.cwd()}/src`, 'api');
const modulesDirectory = path.join(`${process.cwd()}/src/database`, 'models');
const pagesDirectory = path.join(`${process.cwd()}/src/database`, 'pages');

const swanConfig = `${process.cwd()}/swan-config.js`;

//directories to copy

const directoriesToCopy = [
    APIDirectory,
    modulesDirectory,
    pagesDirectory
];

//commands

const deleteDitsDirectory = "rm -rf .dist";
const createDistDirectory = "mkdir .dist";

//deleting the dist directory if it already exists

if (fs.existsSync(distDirectory)) {
    runCommant(deleteDitsDirectory);
}

// creating the dist directory

runCommant(createDistDirectory);

// pasting the required directories into the dist directory

directoriesToCopy.forEach((directory) => {
    const copyDirectoryCommand = `cp -r ${directory} ${distDirectory}`;
    runCommant(copyDirectoryCommand);
})

// pasting the swan-config.js file

const copySwanConfig = `cp ${swanConfig} ${distDirectory}`;

runCommant(copySwanConfig)


