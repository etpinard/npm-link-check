var fs = require('fs');
var path = require('path');
var glob = require('glob');


/**
 * @param {string} pathToRoot path to root of project
 * @param {function} cb callback executed when a linked package is found
 *      @param {string} pkgName name of found linked package
 *      @param {string} foundPath (full) of found linked package
 */
module.exports = function npmLinkCheck(pathToRoot, cb) {
    globNodeModules(pathToRoot, cb);
};

function globNodeModules(startPath, cb) {
    var pathToNodeModules = path.join(startPath, 'node_modules');

    glob(pathToNodeModules + '/*', function(err, foundPaths) {
        foundPaths.forEach(function(foundPath) {
            fs.lstat(foundPath, function(err, stats) {

                if(stats.isDirectory()) {
                    globNodeModules(foundPath);
                }
                else if(stats.isSymbolicLink()){
                    var pkgName = path.basename(foundPath);

                    cb(pkgName, foundPath);
                }

                return;
            });
        });
    });
}
