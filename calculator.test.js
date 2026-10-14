'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const calculator = require('./calculator');

test('arithmetic handles negative numbers, decimals, and zero', () => {
  assert.equal(calculator.add(-2, 3.5), 1.5);
  assert.equal(calculator.subtract(2, 5), -3);
  assert.equal(calculator.multiply(-4, 0.5), -2);
  assert.equal(calculator.divide(9, 2), 4.5);
  assert.equal(calculator.modulo(-10, 3), -1);
  assert.equal(calculator.power(2, -3), 0.125);
  assert.equal(calculator.sqrt(81), 9);
  assert.equal(calculator.percentage(200, 15), 30);
  assert.equal(calculator.percentage(200, 0), 0);
  assert.equal(calculator.multiply(-1, 0), 0);
});

test('rejects invalid operands and arithmetic domains', () => {
  for (const name of ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'percentage']) {
    for (const invalid of ['2', NaN, Infinity, undefined, null]) {
      assert.throws(() => calculator[name](invalid, 1), TypeError);
      assert.throws(() => calculator[name](1, invalid), TypeError);
    }
  }
  assert.throws(() => calculator.sqrt('9'), TypeError);
  assert.throws(() => calculator.sqrt(-1), RangeError);
  assert.throws(() => calculator.divide(1, -0), /zero/);
  assert.throws(() => calculator.modulo(1, 0), /zero/);
  assert.throws(() => calculator.power(-1, 0.5), RangeError);
  assert.throws(() => calculator.multiply(Number.MAX_VALUE, 2), RangeError);
});

test('expressions respect precedence, associativity, parentheses, and unary signs', () => {
  for (const [expression, expected] of [
    ['2 + 3 * (4 - 1)', 11], ['10 - 3 - 2', 5], ['20 / 2 / 5', 2],
    ['2 ^ 3 ^ 2', 512], ['-2 ^ 2', -4], ['(-2) ^ 2', 4],
    ['2 ^ -2', 0.25], ['1 + -2 * +3', -5], ['--2', 2],
    ['.5 + 1.5e2', 150.5], ['1e-3 * 1E3', 1], ['10 % 3', 1],
    ['  (2 + 3) \n * 4  ', 20], ['0', 0],
  ]) assert.equal(calculator.evaluate(expression), expected, expression);
});

test('rejects malformed expressions and executable input', () => {
  for (const expression of ['', ' ', '2 +', '(2 + 3', '2 + 3)', '()',
    '2 3', '2(3)', '2 ** 3', '1e', '1..2', 'Math.sqrt(4)',
    'process.exit()', '1; console.log(1)', 'constructor', '1 / 0', '1e999']) {
    assert.throws(() => calculator.evaluate(expression), undefined, expression);
  }
  assert.throws(() => calculator.evaluate(2), TypeError);
  assert.throws(() => calculator.evaluate('1'.repeat(4097)), /too long/);
  assert.throws(() => calculator.evaluate('('.repeat(130) + '1' + ')'.repeat(130)), /deeply nested/);
});

/** Execute the calculator CLI and capture its output and exit status. */
const run = (...args) => spawnSync(process.execPath, [path.join(__dirname, 'calculator.js'), ...args], { encoding: 'utf8' });

test('CLI prints results and reports errors through exit status and stderr', () => {
  const success = run('2 + 3 * 4');
  assert.equal(success.status, 0);
  assert.equal(success.stdout, '14\n');
  assert.equal(success.stderr, '');
  for (const args of [[], ['1 / 0'], ['2 +']]) {
    const failure = run(...args);
    assert.equal(failure.status, 1);
    assert.equal(failure.stdout, '');
    assert.match(failure.stderr, /^Error:/);
  }
  const help = run('--help');
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage:/);
});

test('importing the library produces no output', () => {
  const imported = spawnSync(process.execPath, ['-e', 'require("./calculator")'], { cwd: __dirname, encoding: 'utf8' });
  assert.equal(imported.status, 0);
  assert.equal(imported.stdout, '');
  assert.equal(imported.stderr, '');
});
