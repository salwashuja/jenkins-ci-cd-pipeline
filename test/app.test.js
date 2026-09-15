
const test = require('node:test');
const assert = require('node:assert');
const { add } = require('../app');

test('addition works correctly', () => {
    assert.strictEqual(add(2, 3), 5;
});

