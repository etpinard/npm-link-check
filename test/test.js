var path = require('path');
var assert = require('assert');
var npmLinkCheck = require('../index.js');
var makeProjectSimple = require('./cases/project_simple');

var DELAY = 1000;


describe('simple project', function(done) {
    var pathToProject = path.join(__dirname, 'build', 'project_simple');
    var pkgList = [];
    var foundPathList = [];

    before(function(done) {
       makeProjectSimple();

        npmLinkCheck(pathToProject, function(pkgName, foundPath) {
            pkgList.push(pkgName);
            foundPathList.push(foundPath);
        });

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
