# Boilerplate gulp tasks for client-side packages

Assigns a bunch of common tasks to gulp, enforces some opinion on code
architecture, but is configurable. Intended for individual modules rather than
full applications (containing multiple modules).

# Tasks
```sh
# Creates a clean, full build with testing, linting, reporting and
# minification then copies the results to the dist folder.
gulp # alias for gulp dist

# Incrementally build JavaScript and CSS files as they're modified and then
# execute testing and linting tasks. Also starts a server on port 3000
# which serves both the example and build directories. If either has files which
# change, connected browsers will automatically refresh.
gulp dev

# Run unit tests once via Karma according to the options set in recess config
# and generate a coverage report.
gulp test

# Runs the JavaScript sources files through JSHint according to the options
# set in jsHintConfig, and the CSS source files through Recess according to
# the options set in recessConfig.
gulp lint

# *REWRITES* the JavaScript files by passing them through JS Beautifier with
# the options set by jsBeautifierConfig.
gulp fix-style

```

# Use
Install by executing `npm install --save-dev boilerplate-gulp`. Then modify
your `gulpfile.js` (or create one):

```javascript
var gulp = require('gulp'), 
  boilerplate = require('boilerplate-gulp');

boilerplate(gulp, {
  pkg: require('./package.json'),

  // The following are optional
  jsMain: pkg.main, // Entry point for browserify
  cssMain: 'src/css/main.less', // Entry point for LESS
  connectConfig: {}, // passed into gulp-connect's connect.server()
  karmaConfig: {}, // passed to karma's karma.start()
  jsHintConfig: {}, // passed to gulp-jshint's jshint()
  jsBeautifierConfig: {}, // passed to js-beautify's beautify()
  recessConfig: {} // passed to gulp-recess's recess()
});

// Rest of your gulp file, potentially overwriting the boilerplate tasks...
```

# Default Filesystem Structure

* dist/ - The distributable files for this package, updated when `gulp` is run
* build/ - The build directory used by gulp during builds.
* dev/ - Development related files (such as custom tasks or configuration).
* example/ - The root directory served during `gulp dev`.
* src/js/ - CommonJS modules which describe the JS source of the package.
* src/js/[PACKAGE_NAME].js - Entry-point for browserify.
* src/css/ - LESS files which describe the CSS source of the package.
* src/css/[PACKAGE_NAME].less - Entry-point for less.
* reports/ - Coverage an static analysis reports.

All of these directories are configurable via your package.json's directory
parameter, like so:
```javascript
{
...
  "directories": {
    "dist": "dist",
    "build": "build",
    "dev": "dev",
    "example": "example",
    "jsSrc": "src/js/",
    "cssSrc": "src/css",
    "reports": "reports"
  }
...
}
```
