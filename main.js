var bpcss = require('boilerplate-gulp-css'),
  bpjs = require('boilerplate-gulp-js'),
  gulp = require('gulp');

module.exports = function(gulp, config){
  config = config || {};

  var DEFAULTS = {
    connect: {
      root: ['./example', './build']
    }
  };

  // Populate options with defaults if it doesn't contain them
  Object.keys(DEFAULTS).forEach(function(key){
    if(!(key in config)) config[key] = DEFAULTS[key];
  });

  gulp.task('bp:server', require('./lib/server')(gulp, config));

  bpcss(gulp, config.css);
  bpjs(gulp, config.js);

  gulp.task('bp:build', gulp.parallel(
    'bpjs:build',
    'bpcss:build'
  ));

  gulp.task('bp:dev', gulp.parallel(
    'bpjs:dev',
    'bpcss:dev',
    'bp:server'
  ));
};
