# npm-link-check

[![npm version](https://badge.fury.io/js/npm-link-check.svg)](https://badge.fury.io/js/npm-link-check)

[![Build Status](https://travis-ci.org/etpinard/npm-link-check.svg?branch=master)](https://travis-ci.org/etpinard/npm-link-check)
[![Dependency Status](https://david-dm.org/etpinard/npm-link-check.svg?style=flat-square)](https://david-dm.org/etpinard/npm-link-check)
[![devDependency Status](https://david-dm.org/etpinard/npm-link-check/dev-status.svg?style=flat-square)](https://david-dm.org/etpinard/npm-link-check#info=devDependencies)

CLI utility that checks whether a project's current node modules tree contains npm-link'ed packages.

So that you don't build a distributed bundle containing linked packages ever again!

## Install

```bash
# for CLI use:
npm install -g npm-link-check

# for npm-script use:
npm install npm-link-check
```

## Usage

#### CLI

```bash
# to check current working directory
npm-link-check

# to check arbitrary project
npm-link-check path/to/project/root
```

#### As a pre-version check

In this era of bundled and transpiled javascript, it is common for projects to
build a distributed version when running the [`npm
version`](https://docs.npmjs.com/cli/version) task. Using `npm-link-check`, the
often neglected check for npm-link'ed packages can automated as follow:

In your project's `package.json`, add:

```json
{
    "scripts": {
        "preversion": "npm-link-check"
    }
}
```

making `npm-link-check` run on `npm version` before your package's version is
bumped. If an npm-link'ed package if found, the `npm version` task will be
aborted.

## Credits

2016 Étienne Tétreault-Pinard. MIT License
