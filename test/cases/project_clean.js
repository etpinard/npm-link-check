const fs = require('fs-extra')
const path = require('path')
const { isPlainObject } = require('is-plain-object')

const buildPath = path.join(__dirname, '..', 'build')
const dirName = path.basename(__filename).split('.')[0]
const dirPath = path.join(buildPath, dirName)
const pathToFakeLinkTarget = path.join(buildPath, 'fake.js')

const fakeContent = 'module.exports = {};\n'

const fakeModules = {
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
    const fakeModule = fakeModules[fakeModuleName]
    const nodeModulesPath = getNodeModulesPath(rootPath)
    const pathToFakeModule = path.join(nodeModulesPath, fakeModuleName)

    if (isPlainObject(fakeModule)) {
      fs.emptyDirSync(pathToFakeModule)
      makeModules(pathToFakeModule, fakeModule)
    } else {
      if (fakeModule === '') {
        const pathToFakeIndex = path.join(pathToFakeModule, 'index.js')

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
