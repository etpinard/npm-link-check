#!/usr/bin/env node

var path = require('path');
var chalk = require('chalk');
var npmLinkCheck = require('./index');

var pathToRoot = process.argv[2] ? process.argv[2] : '.';


function cb(pkgName) {
    process.stderr.write([
        chalk.bold.red('ERROR:'), pkgName, 'is linked!\n'
    ].join(' '));
}

npmLinkCheck(pathToRoot, cb);
