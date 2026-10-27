
const test = require('node:test');
const assert = require('node:assert');
const { add, subtract, multiply } = require('../app');

test('addition works correctly', () => {
    assert.strictEqual(add(2, 3), 5);
});

test('subtraction works correctly', () => {
    assert.strictEqual(subtract(5, 3), 2);
});

test('multiplication works correctly', () => {
    assert.strictEqual(multiply(2, 3), 6);
});