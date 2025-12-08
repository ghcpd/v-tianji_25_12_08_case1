const assert = require('assert');

// Load functions to test
const { validateAgentInput } = require('../src/utils/agentTools');
const { transformData } = require('../src/utils/dataProcessor');
const { processDataArray } = require('../src/utils/dataProcessor');
const { formatAgentResponse } = require('../src/utils/agentTools');

function testValidate() {
  assert.deepStrictEqual(validateAgentInput('ab'), { valid: false, error: 'Input must be at least 3 characters' });
  assert.deepStrictEqual(validateAgentInput(123), { valid: false, error: 'Input must be a string' });
  assert.deepStrictEqual(validateAgentInput('hello'), { valid: true });
}

function testTransform() {
  const s = 'Hello';
  assert.strictEqual(transformData(s, 'uppercase'), 'HELLO');
  assert.strictEqual(transformData(s, 'lowercase'), 'hello');
  assert.strictEqual(transformData('abc', 'reverse'), 'cba');
  const arr = ['a','B',{value: 'c'}];
  const up = transformData(arr, 'uppercase');
  assert.strictEqual(up[0], 'A');
  assert.strictEqual(up[1], 'B');
  assert.strictEqual(up[2].value, 'C');
}

function testProcessArray() {
  const input = [{ id: '1', value: 10 }, { data: 5 }, 'x'];
  const res = processDataArray(input);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.length, 3);
  assert.strictEqual(res.data[0].id, '1');
}

function testFormatResponse() {
  const resp = { success: true, data: [{ id: '1', content: 'ok' }] };
  const formatted = formatAgentResponse(resp);
  assert.strictEqual(formatted.type, 'array');
  assert.strictEqual(formatted.count, 1);
}

try {
  testValidate();
  testTransform();
  testProcessArray();
  testFormatResponse();
  console.log('OK - tests passed');
} catch (err) {
  console.error('Test failure: ', err.message);
  process.exit(1);
}
