module.exports = function TestClass(){
  this.templated = function(name){
    if(name === undefined) name = 'World';

    return 'Hello, ' + name;
  };

  this.static = function(){
    return 'Hi!';
  };
};
