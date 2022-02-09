#!/usr/bin/env node

//requirements
const fs = require('fs');
const path = require('path');
const run_Commant = require("swan-run-command");

const runCommant = (command) => {
    return new Promise((resolve, reject) => {
        run_Commant(command);
        resolve();
    })
}

//directories

const distDirectory = path.join(`${process.cwd()}`, 'dist');

const APIDirectory = path.join(`${process.cwd()}/src`, 'api');
const modulesDirectory = path.join(`${process.cwd()}/src/database`, 'models');
const pagesDirectory = path.join(`${process.cwd()}/src/database`, 'pages');
const middlewaresDirectory = path.join(`${process.cwd()}/src/middlewares`, 'swan_middlewares');
const swanConfig = `${process.cwd()}/swan-config.js`;

//informations

const deps = require(`${process.cwd()}/package.json`)["dependencies"];
const {packageInfo} = require(swanConfig);

//functions

const getInstallDepsCommand = () => {
    
    const Deps = Object.keys(deps)

    let depsCommand = 'npm install'

    Deps.forEach((dep) => {
        depsCommand = depsCommand + ` ${dep}@${deps[dep]}`
    })

    return depsCommand;
}

//directories to copy to dist folder

const directoriesToCopy = [
    APIDirectory,
    modulesDirectory,
    pagesDirectory,
    middlewaresDirectory
];

//commands

const deleteDitsDirectory = "rm -rf dist";
const createDistDirectory = "mkdir dist";
const installDepsCommand = getInstallDepsCommand();


const copyDirectories = () => {
    return new Promise((resolve, reject) => {
        directoriesToCopy.forEach((directory) => {
            const copyDirectoryCommand = `cp -r ${directory} ${distDirectory}`;
            runCommant(`${copyDirectoryCommand}`);
        });
        resolve();
    })
}

const createPluginJsonFiles = () =>{
    return new Promise((resolve, reject) => {
        fs.readdir(`${distDirectory}/api`, (err, files) => {

            if (err) reject(err);

            files.forEach(async(directory) => {
                
                if(!directory.split('.')[1]){

                    const file = {
                        plugin: packageInfo.name
                    }
                    const fileName = `${distDirectory}/api/${directory}/plugin.json`
                    const newFile = JSON.stringify(file, null, 2)
                    fs.writeFile(fileName, newFile, (err) => {
                        if (err) reject(err);
                    });
                }
                
            });
            resolve();
        });
        resolve()
        
    });
}

const copySwanConfig = `cp ${swanConfig} ${distDirectory}`;

const exec = async() => {
    try {

        //deleting the dist directory if it already exists

        if (fs.existsSync(distDirectory)) {
            await runCommant(deleteDitsDirectory);
        }

        // creating the dist directory

        await runCommant(createDistDirectory);

        // pasting the required directories into the dist directory

        await copyDirectories();

        //creating the plugin config

        await createPluginJsonFiles();

        // pasting the swan-config.js

        await runCommant(copySwanConfig);

        // adding the dependencies

        await runCommant(`cd dist && npm init -y && ${installDepsCommand} && npe name ${packageInfo.name} && npe version ${packageInfo.version}`);

        console.log("Your swan-plugin has been built successfully ! you release the package run the command : 'cd dist && npm publish'");

    } catch (error) {
        console.log(error);
        process.exit(-1);
    }
}

exec();

