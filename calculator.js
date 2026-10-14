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
/** Raise a finite base to a finite exponent, rejecting non-real results. */
function power(a, b) { return result(finite(a) ** finite(b)); }
/** Return the real square root of a nonnegative finite number. */
function sqrt(value) {
  finite(value);
  if (value < 0) throw new RangeError('Cannot take the square root of a negative number');
  return result(Math.sqrt(value));
}
/** Return the specified percentage of a finite value. */
function percentage(value, percent) {
  return multiply(divide(percent, 100), value);
}

module.exports = { add, subtract, multiply, divide, modulo, power, sqrt, percentage };
