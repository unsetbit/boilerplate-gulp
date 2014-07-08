module.exports = {
  browsers: ['PhantomJS'],

  frameworks: [
    'jasmine',
    'commonjs'
  ],

  files: [
    'src/js/**/*.js'
  ],

  preprocessors: {
    '**/src/js/**/*.js': ['commonjs']
  },

  reporters: ['progress'],

  coverageReporter: {
    type: 'html',
    dir: 'reports/coverage'
  }
};