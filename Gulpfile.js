var path = require('path');
var gulp = require('gulp');
var boilerplate = require('./main');

boilerplate(gulp, {
  name: 'example',

  js: {
    entry: path.join(__dirname, 'example/main.js'),
    sources: path.join(__dirname, 'example/**/*.js'),
    tests: path.join(__dirname, 'example/**/*Spec.js'),
    dest: path.join(__dirname, 'build', 'js')
  },

  css: {
    entry: path.join(__dirname, 'example/main.less'),
    sources: path.join(__dirname, 'example/**/*.less'),
    dest: path.join(__dirname, 'build', 'css')
  }
});
