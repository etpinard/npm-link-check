const fs = require('fs-extra')
const path = require('path')

const buildPath = path.join(__dirname, '..', 'build')
const dirName = path.basename(__filename).split('.')[0]
const dirPath = path.join(buildPath, dirName)
const nodeMoulesPath = path.join(dirPath, 'node_modules')
const pathToFakeLinkTarget = path.join(buildPath, 'fake.js')

const fakeContent = 'module.exports = {};\n'

const fakeModules = [
  '@scope/unlinked',
  'module1',
  'module2',
  'module3'
]

const fakeLinkedModules = [
  '@scope/linked',
  'module5'
]

module.exports = function make () {
  fs.emptyDirSync(dirPath)
  fs.emptyDirSync(nodeMoulesPath)
  fs.writeFileSync(pathToFakeLinkTarget, fakeContent)

  fakeModules.forEach(function (fakeModule) {
    const pathToFakeModule = path.join(nodeMoulesPath, fakeModule)
    const pathToFakeIndex = path.join(pathToFakeModule, 'index.js')

    fs.emptyDirSync(pathToFakeModule)
    fs.writeFileSync(pathToFakeIndex, fakeContent)
  })

  fakeLinkedModules.forEach(function (fakeLinkedModule) {
    const pathToFakeModule = path.join(nodeMoulesPath, fakeLinkedModule)

    fs.ensureSymlinkSync(pathToFakeLinkTarget, pathToFakeModule)
  })
}
