var complimenter = require('./main');

describe('complimenter', function() {
  it('should compliment the world by default', function() {
    expect(complimenter()).toBe('Hello, World. You look great!');
  });

  it('should compliment anyone if requested', function() {
    expect(complimenter('everyone')).toBe('Hello, everyone. You look great!');
  });
});
