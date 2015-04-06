# Browser Application Builder

> All the things you would want in a build system for building browser application in one package.

(Building angular modules? Then you'll find this more useful: [boilerplate-gulp-angular](https://github.com/oztu/boilerplate-gulp-angular))

# Tasks
```sh
# Lints, compiles, prefixes, test, and minifies JS and LESS files
# and puts the artifacts in the ./build directory
gulp bp:build

# Watches source files and rebuilds when they are modified and starts a server
# on port 8080 which serves ./build and ./example directories
gulp bp:dev

```

# Use
Execute `npm install --save-dev gulp boilerplate-gulp`, then modify your `Gulpfile.js` like so (or create one):


```javascript
var path = require('path');
var gulp = require('gulp');
var boilerplate = require('boilerplate-gulp');

boilerplate(gulp, {
  name: 'example',

  connect: {
    // The root directories to serve using the development server
    root: ['./example', './build']
  }

  js: {
    // The entry point of the CommonJS module
    entry: path.join(__dirname, 'src/main.js'),

    // All JS files to be linted and included in coverage tests
    sources: path.join(__dirname, 'src/**/*.js'),

    // The Jasmine unit tests
    tests: path.join(__dirname, 'src/**/*Spec.js'),

    // The destination to put the built file
    dest: path.join(__dirname, 'build', 'js')
  },

  css: {
    // The entry point of the LESS module
    entry: path.join(__dirname, 'src/main.less'),

    // The LESS files sources to lint
    sources: path.join(__dirname, 'src/**/*.less'),

    // The destination to put the built file
    dest: path.join(__dirname, 'build', 'css')
  }
});

// Rest of your gulp file, potentially overwriting the boilerplate-gulp tasks...
```

# Capabilities
* Compiles JavaScript CommonJS modules into a single file ([browserify](http://browserify.org/)) which can be loaded directly in a browser, via CommonJS loader, or a AMD loader. Produces both an unminified version and a minified version with  source maps.
* Compiles [LESS](http://lesscss.org/) files into a single CSS file. Produces both an unminified version and a minified version with a source maps.
* Run cross-browser unit tests ([jasmine](http://jasmine.github.io/2.0/introduction.html) & [karma](http://karma-runner.github.io/)) using Chrome, Firefox, and Safari.
* Generates coverage reports ([istanbul](https://github.com/gotwarlost/istanbul)) for unit tests.
* Lints CSS ([recess](http://twitter.github.io/recess/)) and JS ([jshint](http://www.jshint.com/))
* Launch a development server ([connect](http://www.senchalabs.org/connect/)) which automatically reloads browsers ([livereload](http://livereload.com/)) as files get rebuild incrementally ([gulp](http://gulpjs.com/))
