#!/usr/bin/env node

var path = require('path');
var npmLinkCheck = require('./index');

var pathToRoot = process.argv[2] ? process.argv[2] : '.';
var list = [];


function cb(pkgName, foundPath) {
    list.push([
        '  ',
        '- package', pkgName,
        '(at ' + foundPath + ')',
        'is linked'
    ].join(' '));
}

function log() {
    var header = 'Some npm-link\'ed packaged were found:'

    throw new Error(header + '\n' + list.join('\n') + '\n');
}

npmLinkCheck(pathToRoot, cb);

process.on('exit', function() {
    if(list.length) log();
})
