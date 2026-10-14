# Calculator

A dependency-free JavaScript calculator API for Node.js 22 or newer. No installation step is needed.

```js
const calculator = require('./calculator');

calculator.add(2, 3);       // 5
calculator.subtract(7, 2);  // 5
calculator.multiply(4, 3);  // 12
calculator.divide(9, 2);    // 4.5
calculator.modulo(10, 3);   // 1
```

Operands must be finite numbers; numeric strings are rejected. Division or remainder by zero and non-finite results throw errors. Remainder has the dividend's sign. Calculations use JavaScript floating-point numbers, so `0.1 + 0.2` yields `0.30000000000000004`.

## Tests

```sh
npm test
```
