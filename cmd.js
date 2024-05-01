#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const npmLinkCheck = require('./index')

const pathToRoot = process.argv[2] ? process.argv[2] : '.'
const pathToNodeModules = path.join(pathToRoot, 'node_modules')
const list = []

function cb (pkgName, foundPath) {
  list.push([
    '  ',
    '- package', pkgName,
    '(at ' + foundPath + ')',
    'is linked'
  ].join(' '))
}

function log () {
  const header = 'Some npm-link\'ed packaged were found:'

  console.log(header + '\n' + list.join('\n') + '\n')
  process.exitCode = 1
}

fs.stat(pathToNodeModules, function (err, stats) {
  if (err || !stats.isDirectory()) {
    throw new Error(pathToRoot + ' does not have a node_modules folder.')
  }

  npmLinkCheck(pathToRoot, cb)
})

process.on('exit', function () {
  if (list.length) log()
})
