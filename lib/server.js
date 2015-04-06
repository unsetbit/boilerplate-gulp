var connect = require('gulp-connect');

module.exports = function(gulp, config){
  return function(){
    connect.server(config.connect);
  };
};
