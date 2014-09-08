module.exports = {
  browsers: ['Chrome', 'Firefox'],
  frameworks: ['jasmine', 'commonjs'],

  preprocessors: {
    'src/**/!(*Spec).js': ['coverage'],
    'src/**/*.js': ['commonjs']
  },

  reporters: ['coverage', 'junit', 'progress'],
  

  junitReporter: {
    outputFile: 'reports/test/unit/junit/test-results.xml',
    suite: ''
  },

  coverageReporter: {
    reporters: [
      { type: 'html', dir: 'reports/test/unit/coverage' },
      { type: 'lcovonly', dir: 'reports/test/unit/coverage' },
      { type: 'json', dir: 'reports/test/unit/coverage' },
      { type: 'cobertura', dir: 'reports/test/unit/coverage' }
    ]
  }
};
