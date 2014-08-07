'use strict';

var source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  csso = require('gulp-csso'),
  jshint = require('gulp-jshint'),
  beautify = require('js-beautify'),
  del = require('del'),
  recess = require('gulp-recess'),
  
  jasmine = require('gulp-jasmine'),
  istanbul = require('gulp-istanbul'),
  
  jasmineReporters = require('jasmine-reporters'),

  _ = require('lodash'),
  plato = require('gulp-plato'),
  gutil = require('gulp-util'),
  es = require('event-stream'),
  fs = require('fs'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  path = require('path'),
  jsStylish = require('jshint-stylish');

var defaultJSBeautifyConfig = require('./defaultJSBeautifyConfig'),
  defaultJSHintConfig = require('./defaultJSHintConfig'),
  defaultConnectConfig = require('./defaultConnectConfig'),
  defaultRecessConfig = require('./defaultRecessConfig');

module.exports = function(gulp, options){
  options = options || {};

  // Generate configuration by taking defaults and applying the optional overrides
  // on top of them.
  var jsBeautifyConfig = _.assign(defaultJSBeautifyConfig, options.jsBeautifyConfig),
    jsHintConfig = _.assign(defaultJSHintConfig, options.jsHintConfig),
    recessConfig = _.assign(defaultRecessConfig, options.recessConfig),
    connectConfig = _.assign(defaultConnectConfig, options.connectConfig),
    pkg = options.pkg || {},
    name = options.name || pkg.name || 'seed',
    jsSrcDir = './src',
    cssSrcDir = './src',
    buildDir = './build',
    distDir = './dist',
    devDir = './dev',
    reportsDir = './reports',
    jsMain = jsSrcDir + '/' + name + '.js',
    cssMain = cssSrcDir + '/' + name + '.less',
    cssDisabled = !!options.disableCss;

  if(options.jsMain !== undefined) jsMain = options.jsMain;
  if(options.cssMain !== undefined) cssMain = options.cssMain;

  if(pkg.directories){
    if(pkg.directories.buildDir) buildDir = pkg.directories.build;
    if(pkg.directories.distDir) distDir = pkg.directories.dist;
    if(pkg.directories.reportsDir) reportsDir = pkg.directories.reports;
    if(pkg.directories.devDir) devDir = pkg.directories.dev;

    if(!options.jsMain && pkg.main) jsMain = pkg.main;
    
    if(pkg.directories.jsSrc !== undefined){
      jsSrcDir = pkg.directories.jsSrc;

      if(!options.jsMain && !pkg.main) jsMain = jsSrcDir + '/' + name + '.js';
    }

    if(pkg.directories.cssSrc !== undefined){
      cssSrcDir = pkg.directories.cssSrc;

      if(!options.cssMain) cssMain = cssSrcDir + '/' + name + '.less';
    }
  }

  var continuous = false;
    
  //*******************//
  // Convenience Tasks //
  //*******************//
  
  // The default task will run dist, which includes build, optimizations, tests, 
  // lints, and generates coverage reports.
  gulp.task('default', ['dist']);

  // Builds an uniminfied version of the CSS and JavaScript files with embedded
  // source maps.
  var buildTasks = ['js'];
  if(!cssDisabled) buildTasks.push('css');
  gulp.task('build', buildTasks);

  // Builds minified versions of the CSS and JavaScript files with external
  // source maps.
  var buildMinTasks = ['js-min'];
  if(!cssDisabled) buildTasks.push('css-min');
  
  gulp.task('build-min', buildMinTasks);


  //*******************//
  // Development Tasks //
  //*******************//
  // Wipe out all generated files which are generated via build tasks.
  gulp.task('clean', ['clean-reports', 'clean-dist', 'clean-build']);

  gulp.task('clean-reports', function(done){
    del([reportsDir], done);
  });

  gulp.task('clean-dist', function(done){
    del([distDir], done);
  });

  gulp.task('clean-build', function(done){
    del([buildDir], done);
  });

  // Incrementally build JavaScript and CSS files as they're modified and then
  // execute testing and linting tasks. Also starts a connect server which
  // reloads connected browsers whenever example or build dir changes contents.
  gulp.task('dev', ['example'], function() {
    continuous = true;
    
    gulp.watch([
      jsSrcDir + '/**/*.js',
      '!' + jsSrcDir + '/**/*Spec.js'
    ], ['js']);

    gulp.watch([
      jsSrcDir + '/**/*.js',
      devDir + '/**/*.js',
      'gulpfile.js'
    ], ['js-lint', 'test']);

    if(!cssDisabled){
      gulp.watch(cssSrcDir + '/**/*.css', ['css', 'lint-css']);
    }

    return test();
  });

  gulp.task('example', ['build'], function() {
    connect.server(connectConfig);

    watch({
      glob: connectConfig.root.map(function(dir){ return dir + '/**/*'; })
    }).pipe(connect.reload());
  });


  // Creates a clean, full build with testing, linting, reporting and
  // minification then copies the results to the dist folder.
  gulp.task('dist', ['clean', 'test', 'lint', 'report', 'build-min'], 
    function() {
    return gulp.src(buildDir + '/**/*')
      .pipe(gulp.dest(distDir));
  });

  //*************************//
  // JavaScript Bundler Tasks //
  //*************************//
  // Generates a JavaScript bundle of jsMain and its dependencies using
  // browserify in the build directory with an embedded sourcemap.
  gulp.task('js', ['clean-js'], function() {
    return browserify(jsMain)
      .bundle({
        debug: true,
        standalone: name
      }) // Debug enables source maps
      .pipe(source(path.basename(jsMain))) // gulpifies the browserify stream
      .pipe(rename(name + '.js'))
      .pipe(gulp.dest(buildDir));
  });

  // Generates a minified JavaScript bundle in the build directory with an
  // accompanying source map file.
  gulp.task('js-min', ['js'], function() {
    return gulp.src(buildDir + '/' + name + '.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename(name + '.min.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildDir));
  });

  // Deletes generated JavaScript files (and source maps) from the build
  // directory.
  gulp.task('clean-js', function(done) {
    del([buildDir + '/**/*.js{,.map}'], done);
  });


  //*******************//
  // CSS Bundler Tasks //
  //*******************//

  // Deletes generated CSS files (and source maps) from the build directory.
  gulp.task('clean-css', function(cb) {
    del([buildDir + '/**/*.css{,map}'], cb);
  });

  // Generates a CSS bundle of cssMain and its dependencies using LESS
  // in the build directory with an embedded source map.
  gulp.task('css', ['clean-css'], function() {
    return gulp.src(cssMain)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(rename(name + '.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(buildDir));
  });

  // Generates a minified CSS bundle in the build directory with an accompanying
  // source map.
  gulp.task('css-min', ['css'], function() {
    return gulp.src(buildDir + '/' + name + '.css')
      .pipe(rename(name + '.min.css'))
      .pipe(sourcemaps.init())
      .pipe(csso())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildDir));
  });


  //*******************//
  // Quality Ensurance //
  //*******************//

  // Generates test coverage and code maintainabilty reports.
  gulp.task('report', ['test', 'plato']);

  function test(done){
    if (continuous){
      return gulp.src([
        jsSrcDir + '/**/*.js'
      ]).pipe(jasmine({
          includeStackTrace: true
        }))
    } else {
      var junitReporter = new jasmineReporters.JUnitXmlReporter({
          savePath: 'reports/junit',
          consolidateAll: false
      });

      gulp.src([
        jsSrcDir + '/**/*.js',
        '!' + jsSrcDir + '/**/*Spec.js' // exclude tests
      ]).pipe(istanbul())
        .on('finish', function () {
          gulp.src([
            jsSrcDir + '/**/*.js'
          ]).pipe(jasmine({
              reporter: junitReporter,
              verbose: true,
              includeStackTrace: true
            }))
          .pipe(istanbul.writeReports({
            dir: './reports/coverage',
            reporters: [ 'lcovonly', 'text', 'json', 'html', 'cobertura' ]
          }))
          .on('end', done);
      });
    }
  };

  gulp.task('test', function(done) {
    return test(done);
  });

  // Generates a maintainability report using Plato.
  gulp.task('plato', ['clean-reports'], function(done){
    return gulp.src([
      jsSrcDir + '/**/*.js',
      '!' + jsSrcDir + '/**/*Spec.js' // exclude tests
    ]).pipe(plato('reports/plato', { 
        jshint: {
          options: jsHintConfig
        }
      }));
  });

  // Runs the JavaScript sources files through JSHint according to the options
  // set in jsHintConfig, and the CSS source files through Recess according to
  // the options set in recessConfig.
  var lintTasks = ['js-lint'];
  if(!cssDisabled) lintTasks.push('css-lint');
  gulp.task('lint', lintTasks);

  // Runs the JavaScript source files via JSHint according to the options set in
  // jsHintConfig.
  gulp.task('js-lint', function() {
    var config = jsHintConfig;

    var pipe = gulp.src([
        jsSrcDir + '/**/*.js',
        devDir + '/**/*.js',
        'gulpfile.js'
      ])
      .pipe(jshint(jsHintConfig))
      .pipe(jshint.reporter(jsStylish));

    if (!continuous){
      pipe = pipe.pipe(jshint.reporter('fail'));
    }

    return pipe;
  });

  // Runs the LESS source files via recess according to the options set in
  // recessConfig.
  gulp.task('css-lint', function() {
    return gulp.src(cssSrcDir + '/**/*.less')
      .pipe(recess(recessConfig));
  });

  // *REWRITES* This project's JavaScript files, passing them through JS 
  // Beautifier with the options in jsBeautifyConfig
  gulp.task('fix-style', function() {
    return gulp.src([
        jsSrcDir + '/**/*.js',
        devDir + '/**/*.js',
        'gulpfile.js'
      ])
      .pipe(es.map(function(file, cb) {
        try {
          file.contents = new Buffer(
            beautify(String(file.contents), jsBeautifyConfig)
          );
          fs.writeFile(file.path, file.contents, function() {
            cb(null, file);
          });
        } catch (err) {
          return cb(new gutil.PluginError(
            'fix-style', 
            err, 
            jsBeautifyConfig
          ));
        }
      }));
  });
};