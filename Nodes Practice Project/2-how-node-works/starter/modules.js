console.log(arguments);
console.log(require("module").wrapper);

//module.exports
const Calculator = require("./testing-1");
const calc1 = new Calculator();
console.log(calc1.add(5, 5));
console.log(calc1.subtract(5, 5));
console.log(calc1.multiply(5, 5));
console.log(calc1.divide(5, 5));

//exports
const calc2 = require("./testing-2");
console.log(`calc2 result: ${calc2.add(5, 5)}`);
console.log(`calc2 result: ${calc2.subtract(5, 5)}`);
console.log(`calc2 result: ${calc2.multiply(5, 5)}`);
console.log(`calc2 result: ${calc2.divide(5, 5)}`);

//caching
require("./testing-3")();
require("./testing-3")();
require("./testing-3")();

//result of caching is
// Hello from the module
// Log this text
// Log this text
// Log this text
// => this is because the module is cached and the function is called 3 times, only executeed the file one time
