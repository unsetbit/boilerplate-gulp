var GreeterClass = require('./deps/GreeterClass');

function complimentWrapper(greetingGenerator) {
  return function(target) {
    return greetingGenerator(target) + '. You look great!';
  };
}

var greeter = new GreeterClass();

module.exports = complimentWrapper(greeter.templated);
