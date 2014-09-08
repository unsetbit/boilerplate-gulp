# Client-side JavaScript Module Builder

> All the things you would want in a build system for client-side JavaScript projects in one package.

# Capabilities
* Compiles JavaScript CommonJS modules into a single file ([browserify](http://browserify.org/)) which can be loaded directly in a browser, via CommonJS loader, or a AMD loader. Produces both an unminified version and a minified version with  source maps.
* Compiles [LESS](http://lesscss.org/) files into a single CSS file. Produces both an unminified version and a minified version with a source maps.
* Run cross-browser unit tests ([jasmine](http://jasmine.github.io/2.0/introduction.html) & [karma](http://karma-runner.github.io/)) using Chrome, Firefox, and Safari.
* Generates coverage reports ([istanbul](https://github.com/gotwarlost/istanbul)) for unit tests.
* Lints CSS ([recess](http://twitter.github.io/recess/)) and JS ([jshint](http://www.jshint.com/))
* Generate complexity/maintainability reports ([plato](https://github.com/es-analysis/plato))
* Launch a development server ([connect](http://www.senchalabs.org/connect/)) which automatically reloads browsers ([livereload](http://livereload.com/)) as files get rebuild incrementally ([gulp](http://gulpjs.com/))
* Automatically formats JavaScript files to match a given style guide ([js beautifier](https://github.com/beautify-web/js-beautify)).

# Technology Used
* [gulp](http://gulpjs.com/) - Build engine
* [browserify](http://browserify.org/) - Bundles CommonJS modules for use in 
browsers
* [jshint](http://www.jshint.com/) - JavaScript linter
* [uglify](https://github.com/mishoo/UglifyJS2/) - JavaScript minifier
* [less](http://lesscss.org/) - CSS preprocessor
* [csso](https://github.com/css/csso) - CSS minifier
* [recess](http://twitter.github.io/recess/) - CSS linter
* [jasmine](http://jasmine.github.io/2.0/introduction.html) - JavaScript testing framework
* [karma](http://karma-runner.github.io/) - Cross-browser unit test runner
* [istanbul](https://github.com/gotwarlost/istanbul) - JavaScript test coverage
analysis tool
* [js beautifier](https://github.com/beautify-web/js-beautify) - JavaScript
reformatter
* [plato](https://github.com/es-analysis/plato) - Complexity and maintainability
analysis for JavaScript source code
* [connect](http://www.senchalabs.org/connect/) - HTTP server for development 
use
* [livereload](http://livereload.com/) - Automatic reloading of browsers which
are connected to the development server

To see it in action see [client-side-seed](https://github.com/oztu/client-side-seed).

# Tasks
```sh
# Creates a clean, full build with testing, linting, reporting and
# minification then copies the results to the ./dist folder.
gulp

# Incrementally builds files as they're modified and then
# executes testing and linting tasks. Also starts a server on port 3000
# which serves both the example and build directories. Connected browsers
# will automatically refresh when files are updated.
gulp dev

# Runs unit tests and generates coverage reports to ./report
gulp test

# Runs gulp test along with generating code complexity reports ./report
gulp reports

# Rewrite JavaScript source files by passing them through JS Beautifier
gulp fix-style

```

# Use
If you don't have a `package.json` file at the root of your code repository, execute `npm init` to generate one. Modify the "main" key in package.json to point to your root CommonJS module, whatever is assigned to `module.exports` or `exports` in this module will be "exported" to the `window.<package.name>` variable on browsers.

Next, executing `npm install --save-dev gulp boilerplate-gulp`. Then modify
your `gulpfile.js` (or create one):

```javascript
var gulp = require('gulp'), 
  boilerplate = require('boilerplate-gulp');

boilerplate(gulp, {
  jsMain: 'path/to/js/main.js',
  cssMain: 'path/to/css/main.less'
});

// Rest of your gulp file, potentially overwriting the boilerplate-gulp tasks...
```

# Default Directory Structure

* dist/ - The distributable files for this package, updated when `gulp` is run
* build/ - The build directory used by gulp during builds.
* example/ - The root directory served during `gulp dev`.
* src/ - Source code and accompanying unit tests
* test/ - End-to-end tests
* reports/ - Generated reports (testing, coverage, complexity)
