var generator = require('./index.js');
var numbers = generator.generate('1987-08-23', 'm');
console.log(numbers);
console.log('total:', numbers.length);
