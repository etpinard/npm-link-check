var path = require('path');
var assert = require('assert');
var glob = require('glob');
var npmLinkCheck = require('../index.js');

var DELAY = 1000;

describe('simple project', function() {
    var makeProjectSimple = require('./cases/project_simple');
    var pathToProject = path.join(__dirname, 'build', 'project_simple');

    var pkgList = [];
    var foundPathList = [];

    function cb(pkgName, foundPath) {
        pkgList.push(pkgName);
        foundPathList.push(foundPath);
    }

    before(function(done) {
        makeProjectSimple();
        npmLinkCheck(pathToProject, cb);

        setTimeout(done, DELAY);
    });

    it('should have 2 linked module detected', function() {
        assert.equal(pkgList.length, 2);
    });

    it('should have 2 linked paths detected', function() {
        assert.equal(foundPathList.length, 2);
    });

    it('should list the linked module names', function() {
        ['module4', 'module5'].forEach(function(moduleName) {
            assert.ok(pkgList.indexOf(moduleName) !== -1);
        });
    });

    it('should list the linked paths', function() {
        ['module4', 'module5'].forEach(function(moduleName) {
            var pathToModule = path.join(pathToProject, 'node_modules', moduleName);

            assert.ok(foundPathList.indexOf(pathToModule) !== -1);
        });
    });
});

describe('nested project', function() {
    var makeProjectNested = require('./cases/project_nested');
    var pathToProject = path.join(__dirname, 'build', 'project_nested');

    var pkgList = [];
    var foundPathList = [];

    function cb(pkgName, foundPath) {
        pkgList.push(pkgName);
        foundPathList.push(foundPath);
    }

    before(function(done) {
        makeProjectNested();
        npmLinkCheck(pathToProject, cb);

        setTimeout(done, DELAY);
    });

    it('should have 3 linked module detected', function() {
        assert.equal(pkgList.length, 3);
    });

    it('should have 3 linked paths detected', function() {
        assert.equal(foundPathList.length, 3);
    });

    it('should list the linked module names', function() {
        ['module1111', 'module23', 'module3'].forEach(function(moduleName) {
            assert.ok(pkgList.indexOf(moduleName) !== -1);
        });
    });

    it('should list the linked paths', function(done) {
        ['module1111', 'module23', 'module3'].forEach(function(moduleName) {
            glob(pathToProject + '/**/' + 'module1111', function(err, files) {
                if(err) throw err;

                var pathToModule = files[0];

                assert.ok(foundPathList.indexOf(pathToModule) !== -1);
            });
        });

        setTimeout(done, DELAY);
    });
});

