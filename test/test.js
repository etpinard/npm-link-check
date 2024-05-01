/* eslint-env mocha */

const path = require('path')
const assert = require('assert')
const glob = require('glob')
const exec = require('child_process').exec
const npmLinkCheck = require('../index.js')

const CMD = 'node ' + path.join(__dirname, '..', 'cmd.js') + ' '
const DELAY = 1000

describe('simple project', function () {
  const makeProject = require('./cases/project_simple')
  const pathToProject = path.join(__dirname, 'build', 'project_simple')

  const pkgList = []
  const foundPathList = []

  function cb (pkgName, foundPath) {
    pkgList.push(pkgName)
    foundPathList.push(path.normalize(foundPath))
  }

  before(function (done) {
    makeProject()
    npmLinkCheck(pathToProject, cb)

    setTimeout(done, DELAY)
  })

  it('should have 2 linked module detected', function () {
    assert.strictEqual(pkgList.length, 2)
  })

  it('should have 2 linked paths detected', function () {
    assert.strictEqual(foundPathList.length, 2)
  })

  it('should list the linked module names', function () {
    ['module4', 'module5'].forEach(function (moduleName) {
      assert.ok(pkgList.indexOf(moduleName) !== -1)
    })
  })

  it('should list the linked paths', function () {
    ['module4', 'module5'].forEach(function (moduleName) {
      const pathToModule = path.join(pathToProject, 'node_modules', moduleName)

      assert.ok(foundPathList.indexOf(pathToModule) !== -1)
    })
  })

  it('should make cmd.js log', function (done) {
    exec(CMD + pathToProject, function (err, stdout, stderr) {
      if (err) assert.ok(err)
      assert.ok(/Some npm-link'ed packaged were found:/.test(stdout))

      done()
    })
  })
})

describe('nested project', function () {
  const makeProject = require('./cases/project_nested')
  const pathToProject = path.join(__dirname, 'build', 'project_nested')

  const pkgList = []
  const foundPathList = []

  function cb (pkgName, foundPath) {
    pkgList.push(pkgName)
    foundPathList.push(foundPath)
  }

  before(function (done) {
    makeProject()
    npmLinkCheck(pathToProject, cb)

    setTimeout(done, DELAY)
  })

  it('should have 3 linked module detected', function () {
    assert.strictEqual(pkgList.length, 3)
  })

  it('should have 3 linked paths detected', function () {
    assert.strictEqual(foundPathList.length, 3)
  })

  it('should list the linked module names', function () {
    ['module1111', 'module23', 'module3'].forEach(function (moduleName) {
      assert.ok(pkgList.indexOf(moduleName) !== -1)
    })
  })

  it('should list the linked paths', function (done) {
    ['module1111', 'module23', 'module3'].forEach(function (moduleName) {
      glob(pathToProject + '/**/' + moduleName, function (err, files) {
        if (err) assert.fail(err, null)

        const pathToModule = files[0]

        assert.ok(foundPathList.indexOf(pathToModule) !== -1)
      })
    })

    setTimeout(done, DELAY)
  })

  it('should make cmd.js log', function (done) {
    exec(CMD + pathToProject, function (err, stdout, stderr) {
      if (err) assert.ok(err)

      assert.ok(/Some npm-link'ed packaged were found:/.test(stdout))

      done()
    })
  })
})

describe('scoped project', function () {
  const makeProject = require('./cases/project_scoped')
  const pathToProject = path.join(__dirname, 'build', 'project_scoped')

  const pkgList = []
  const foundPathList = []

  function cb (pkgName, foundPath) {
    pkgList.push(pkgName)
    foundPathList.push(foundPath)
  }

  before(function (done) {
    makeProject()
    npmLinkCheck(pathToProject, cb)

    setTimeout(done, DELAY)
  })

  it('should have 2 paths detected', function () {
    assert.strictEqual(pkgList.length, 2)
  })

  it('should have 2 linked paths detected', function () {
    assert.strictEqual(foundPathList.length, 2)
  })
})

describe('clean project', function () {
  const makeProject = require('./cases/project_clean')
  const pathToProject = path.join(__dirname, 'build', 'project_clean')

  const pkgList = []
  const foundPathList = []

  function cb (pkgName, foundPath) {
    pkgList.push(pkgName)
    foundPathList.push(foundPath)
  }

  before(function (done) {
    makeProject()
    npmLinkCheck(pathToProject, cb)

    setTimeout(done, DELAY)
  })

  it('should have 0 linked module detected', function () {
    assert.strictEqual(pkgList.length, 0)
  })

  it('should have 0 linked paths detected', function () {
    assert.strictEqual(foundPathList.length, 0)
  })

  it('should not make cmd.js throw an error', function (done) {
    exec(CMD + pathToProject, function (err) {
      if (err) assert.fail(err, null)
      assert.strictEqual(err, null)

      done()
    })
  })
})

describe('error handling', function () {
  it('should throw an error when targeted project does not have a node_modules folder', function (done) {
    exec(CMD + 'build/', function (err, stdout, stderr) {
      if (err) assert.ok(err)
      assert.ok(/build\/ does not have a node_modules folder./.test(stderr))

      done()
    })
  })
})
