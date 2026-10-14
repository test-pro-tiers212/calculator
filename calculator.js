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

const operators = {
  '+': { precedence: 1, apply: add },
  '-': { precedence: 1, apply: subtract },
  '*': { precedence: 2, apply: multiply },
  '/': { precedence: 2, apply: divide },
  '%': { precedence: 2, apply: modulo },
  '^': { precedence: 4, apply: power },
};

// Parse arithmetic only: expressions never execute JavaScript.
/** Evaluate bounded arithmetic expressions without executing JavaScript. */
function evaluate(expression) {
  if (typeof expression !== 'string' || expression.trim() === '') {
    throw new TypeError('Expected a non-empty expression');
  }
  if (expression.length > 4096) throw new RangeError('Expression is too long (maximum 4096 characters)');
  const tokens = [];
  const pattern = /\s+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[()+\-*/%^]/y;
  let offset = 0;
  while (offset < expression.length) {
    pattern.lastIndex = offset;
    const match = pattern.exec(expression);
    if (!match) throw new SyntaxError(`Unexpected character at position ${offset + 1}`);
    if (match[0].trim()) tokens.push(match[0]);
    offset = pattern.lastIndex;
  }
  let cursor = 0;
  /** Parse a precedence-bounded expression with a recursion limit. */
  function parse(minimum = 0, depth = 0) {
    if (depth > 128) throw new RangeError('Expression is too deeply nested');
    const token = tokens[cursor++];
    let value;
    if (token === '+' || token === '-') {
      value = parse(3, depth + 1);
      if (token === '-') value = result(-value);
    } else if (token === '(') {
      value = parse(0, depth + 1);
      if (tokens[cursor++] !== ')') throw new SyntaxError('Expected closing parenthesis');
    } else if (token !== undefined && /^\d|^\.\d/.test(token)) {
      value = finite(Number(token));
    } else {
      throw new SyntaxError('Expected a number or opening parenthesis');
    }
    while (Object.hasOwn(operators, tokens[cursor])) {
      const symbol = tokens[cursor];
      const operator = operators[symbol];
      if (operator.precedence < minimum) break;
      cursor++;
      const right = parse(operator.precedence + (symbol === '^' ? 0 : 1), depth + 1);
      value = operator.apply(value, right);
    }
    return value;
  }
  const value = parse();
  if (cursor !== tokens.length) throw new SyntaxError('Unexpected token after expression');
  return value;
}

module.exports = { add, subtract, multiply, divide, modulo, power, sqrt, percentage, evaluate };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node calculator.js "2 + 3 * (4 - 1)"\nOperators: + - * / % (remainder) ^ (power), parentheses, unary + and -');
  } else {
    try {
      console.log(evaluate(args.join(' ')));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
