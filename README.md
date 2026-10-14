# Calculator

A dependency-free calculator for Node.js 22 or newer. No installation step is needed.

## Command line

Quote expressions so the shell preserves operators and parentheses:

```sh
node calculator.js "2 + 3 * (4 - 1)"  # 11
node calculator.js "2 ^ 3 ^ 2"        # 512
npm start -- "25 / 4"                # 6.25
node calculator.js --help
```

Supports decimal and scientific notation, parentheses, unary `+`/`-`, and operators `+`, `-`, `*`, `/`, `%`, `^`. Multiplication, division and remainder precede addition and subtraction. Powers associate to the right and precede unary signs: `-2 ^ 2` is `-4`, and `2 ^ -2` is `0.25`. `%` is JavaScript's remainder operator (the result has the dividend's sign), not a percentage operator. Implicit multiplication and function calls in expressions are not supported.

Errors go to stderr with exit status 1. Expressions are limited to 4096 characters and 128 recursive parsing levels. Input is parsed as arithmetic and never passed to `eval`.

## JavaScript API

```js
const calculator = require('./calculator');

calculator.add(2, 3);               // 5
calculator.subtract(7, 2);          // 5
calculator.multiply(4, 3);          // 12
calculator.divide(9, 2);            // 4.5
calculator.modulo(10, 3);           // 1
calculator.power(2, 3);             // 8
calculator.sqrt(81);                // 9
calculator.percentage(200, 15);     // 30 (15% of 200)
calculator.evaluate('2 * (3 + 4)'); // 14
```

API operands must be finite numbers; numeric strings are rejected. Division or remainder by zero, negative square roots, and non-finite results throw errors. Calculations use JavaScript floating-point numbers, so `0.1 + 0.2` yields `0.30000000000000004`; this is not a decimal financial calculator.

## Tests

```sh
npm test
```
