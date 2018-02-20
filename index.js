var fs = require('fs')
var path = require('path')
var glob = require('glob')

/**
 * @param {string} pathToRoot path to root of project
 * @param {function} cb callback executed when a linked package is found
 *      @param {string} pkgName name of found linked package
 *      @param {string} foundPath (full) of found linked package
 */
module.exports = function npmLinkCheck (pathToRoot, cb) {
  globNodeModules(pathToRoot, cb)
}

function globNodeModules (startPath, cb) {
  var pathToNodeModules

  // if we have a scope we should check if the modules inside the folder is linked
  if (startPath.includes('@')) {
    pathToNodeModules = startPath
  } else {
    pathToNodeModules = path.join(startPath, 'node_modules')
  }

  glob(pathToNodeModules + '/*', function (err, foundPaths) {
    if (err) console.warn(err)

    foundPaths.forEach(function (foundPath) {
      fs.lstat(foundPath, function (err, stats) {
        if (err) console.warn(err)

        if (stats.isDirectory()) {
          globNodeModules(foundPath, cb)
        } else if (stats.isSymbolicLink()) {
          var pkgName = path.basename(foundPath)
          cb(pkgName, foundPath)
        }
      })
    })
  })
}
