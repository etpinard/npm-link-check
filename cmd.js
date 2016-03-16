#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var npmLinkCheck = require('./index');

var pathToRoot = process.argv[2] ? process.argv[2] : '.';
var pathToNodeModules = path.join(pathToRoot, 'node_modules');
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

fs.stat(pathToNodeModules, function(err, stats) {
    if(err || !stats.isDirectory()) {
        throw new Error(pathToRoot + ' does not have a node_modules folder.');
    }

    npmLinkCheck(pathToRoot, cb);
});

process.on('exit', function() {
    if(list.length) log();
})
