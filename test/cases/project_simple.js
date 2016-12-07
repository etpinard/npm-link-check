var fs = require('fs-extra')
var path = require('path')

var buildPath = path.join(__dirname, '..', 'build')
var dirName = path.basename(__filename).split('.')[0]
var dirPath = path.join(buildPath, dirName)
var nodeMoulesPath = path.join(dirPath, 'node_modules')
var pathToFakeLinkTarget = path.join(buildPath, 'fake.js')

var fakeContent = 'module.exports = {};\n'

var fakeModules = [
  'module1',
  'module2',
  'module3'
]

var fakeLinkedModules = [
  'module4',
  'module5'
]

module.exports = function make () {
  fs.emptyDirSync(dirPath)
  fs.emptyDirSync(nodeMoulesPath)
  fs.writeFileSync(pathToFakeLinkTarget, fakeContent)

  fakeModules.forEach(function (fakeModule) {
    var pathToFakeModule = path.join(nodeMoulesPath, fakeModule)
    var pathToFakeIndex = path.join(pathToFakeModule, 'index.js')

    fs.emptyDirSync(pathToFakeModule)
    fs.writeFileSync(pathToFakeIndex, fakeContent)
  })

  fakeLinkedModules.forEach(function (fakeLinkedModule) {
    var pathToFakeModule = path.join(nodeMoulesPath, fakeLinkedModule)

    fs.ensureSymlinkSync(pathToFakeLinkTarget, pathToFakeModule)
  })
}
