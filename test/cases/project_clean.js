var fs = require('fs-extra')
var path = require('path')
var isPlainObject = require('is-plain-object')

var buildPath = path.join(__dirname, '..', 'build')
var dirName = path.basename(__filename).split('.')[0]
var dirPath = path.join(buildPath, dirName)
var pathToFakeLinkTarget = path.join(buildPath, 'fake.js')

var fakeContent = 'module.exports = {};\n'

var fakeModules = {
  module1: {
    module11: {
      module111: {
        module1111: ''
      },
      module112: ''
    }
  },
  module2: {
    module21: '',
    module22: '',
    module23: '',
    module24: ''
  },
  module3: ''
}

function getNodeModulesPath (rootPath) {
  return path.join(rootPath, 'node_modules')
}

function makeModules (rootPath, fakeModules) {
  Object.keys(fakeModules).forEach(function (fakeModuleName) {
    var fakeModule = fakeModules[fakeModuleName]
    var nodeModulesPath = getNodeModulesPath(rootPath)
    var pathToFakeModule = path.join(nodeModulesPath, fakeModuleName)

    if (isPlainObject(fakeModule)) {
      fs.emptyDirSync(pathToFakeModule)
      makeModules(pathToFakeModule, fakeModule)
    } else {
      if (fakeModule === '') {
        var pathToFakeIndex = path.join(pathToFakeModule, 'index.js')

        fs.emptyDirSync(pathToFakeModule)
        fs.writeFileSync(pathToFakeIndex, fakeContent)
      } else if (fakeModule === 'link') {
        fs.ensureSymlinkSync(pathToFakeLinkTarget, pathToFakeModule)
      }
    }
  })
}

module.exports = function make () {
  fs.emptyDirSync(dirPath)
  fs.emptyDirSync(getNodeModulesPath(dirPath))
  fs.writeFileSync(pathToFakeLinkTarget, fakeContent)

  makeModules(dirPath, fakeModules)
}
