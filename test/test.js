/* eslint-env mocha */

var path = require('path')
var assert = require('assert')
var glob = require('glob')
var exec = require('child_process').exec
var npmLinkCheck = require('../index.js')

var CMD = 'node ' + path.join(__dirname, '..', 'cmd.js') + ' '
var DELAY = 1000

describe('simple project', function () {
  var makeProject = require('./cases/project_simple')
  var pathToProject = path.join(__dirname, 'build', 'project_simple')

  var pkgList = []
  var foundPathList = []

  function cb (pkgName, foundPath) {
    pkgList.push(pkgName)
    foundPathList.push(foundPath)
  }

  before(function (done) {
    makeProject()
    npmLinkCheck(pathToProject, cb)

    setTimeout(done, DELAY)
  })

  it('should have 2 linked module detected', function () {
    assert.equal(pkgList.length, 2)
  })

  it('should have 2 linked paths detected', function () {
    assert.equal(foundPathList.length, 2)
  })

  it('should list the linked module names', function () {
    ['module4', 'module5'].forEach(function (moduleName) {
      assert.ok(pkgList.indexOf(moduleName) !== -1)
    })
  })

  it('should list the linked paths', function () {
    ['module4', 'module5'].forEach(function (moduleName) {
      var pathToModule = path.join(pathToProject, 'node_modules', moduleName)

      assert.ok(foundPathList.indexOf(pathToModule) !== -1)
    })
  })

  it('should make cmd.js throw an error', function (done) {
    exec(CMD + pathToProject, function (err, stdout, stderr) {
      if (err) assert.ok(err)
      assert.ok(/Some npm-link'ed packaged were found:/.test(stderr))

      done()
    })
  })
})

describe('nested project', function () {
  var makeProject = require('./cases/project_nested')
  var pathToProject = path.join(__dirname, 'build', 'project_nested')

  var pkgList = []
  var foundPathList = []

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
    assert.equal(pkgList.length, 3)
  })

  it('should have 3 linked paths detected', function () {
    assert.equal(foundPathList.length, 3)
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

        var pathToModule = files[0]

        assert.ok(foundPathList.indexOf(pathToModule) !== -1)
      })
    })

    setTimeout(done, DELAY)
  })

  it('should make cmd.js throw an error', function (done) {
    exec(CMD + pathToProject, function (err, stdout, stderr) {
      if (err) assert.ok(err)

      assert.ok(/Some npm-link'ed packaged were found:/.test(stderr))

      done()
    })
  })
})

describe('scoped project', function () {
  var makeProject = require('./cases/project_scoped')
  var pathToProject = path.join(__dirname, 'build', 'project_scoped')

  var pkgList = []
  var foundPathList = []

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
    assert.equal(pkgList.length, 2)
  })

  it('should have 2 linked paths detected', function () {
    assert.equal(foundPathList.length, 2)
  })
})

describe('clean project', function () {
  var makeProject = require('./cases/project_clean')
  var pathToProject = path.join(__dirname, 'build', 'project_clean')

  var pkgList = []
  var foundPathList = []

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
    assert.equal(pkgList.length, 0)
  })

  it('should have 0 linked paths detected', function () {
    assert.equal(foundPathList.length, 0)
  })

  it('should not make cmd.js throw an error', function (done) {
    exec(CMD + pathToProject, function (err) {
      if (err) assert.fail(err, null)
      assert.equal(err, null)

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
