'use strict';

/** Validate a finite numeric operand without coercion. */
function finite(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected a finite number');
  }
  return value;
}

/** Reject non-finite results and normalize negative zero. */
function result(value) {
  if (!Number.isFinite(value)) {
    throw new RangeError('Result is outside the range of finite real numbers');
  }
  return Object.is(value, -0) ? 0 : value;
}

/** Add two finite numbers. */
function add(a, b) { return result(finite(a) + finite(b)); }
/** Subtract the second finite number from the first. */
function subtract(a, b) { return result(finite(a) - finite(b)); }
/** Multiply two finite numbers. */
function multiply(a, b) { return result(finite(a) * finite(b)); }
/** Divide two finite numbers, rejecting a zero divisor. */
function divide(a, b) {
  finite(a);
  finite(b);
  if (b === 0) throw new RangeError('Cannot divide by zero');
  return result(a / b);
}
/** Return the remainder with the dividend sign, rejecting zero divisors. */
function modulo(a, b) {
  finite(a);
  finite(b);
  if (b === 0) throw new RangeError('Cannot take a remainder with zero');
  return result(a % b);
}
module.exports = { add, subtract, multiply, divide, modulo };
