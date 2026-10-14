'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const calculator = require('./calculator');

test('arithmetic handles negative numbers, decimals, and zero', () => {
  assert.equal(calculator.add(-2, 3.5), 1.5);
  assert.equal(calculator.subtract(2, 5), -3);
  assert.equal(calculator.multiply(-4, 0.5), -2);
  assert.equal(calculator.divide(9, 2), 4.5);
  assert.equal(calculator.modulo(-10, 3), -1);
  assert.equal(calculator.multiply(-1, 0), 0);
});

test('rejects invalid operands and arithmetic domains', () => {
  for (const name of ['add', 'subtract', 'multiply', 'divide', 'modulo']) {
    for (const invalid of ['2', NaN, Infinity, undefined, null]) {
      assert.throws(() => calculator[name](invalid, 1), TypeError);
      assert.throws(() => calculator[name](1, invalid), TypeError);
    }
  }
  assert.throws(() => calculator.divide(1, -0), /zero/);
  assert.throws(() => calculator.modulo(1, 0), /zero/);
  assert.throws(() => calculator.multiply(Number.MAX_VALUE, 2), RangeError);
});

test('importing the library produces no output', () => {
  const imported = spawnSync(process.execPath, ['-e', 'require("./calculator")'], { cwd: __dirname, encoding: 'utf8' });
  assert.equal(imported.status, 0);
  assert.equal(imported.stdout, '');
  assert.equal(imported.stderr, '');
});
