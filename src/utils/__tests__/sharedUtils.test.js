import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  validateStringInput,
  formatResponse,
  processDataArray,
  processDataObject,
  transformData,
  filterData,
  sendAgentRequest
} from '../sharedUtils';

vi.mock('axios');

describe('sharedUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validateStringInput - invalid inputs', () => {
    expect(validateStringInput('')).toHaveProperty('valid', false);
    expect(validateStringInput('ab')).toHaveProperty('valid', false);
    expect(validateStringInput(123)).toHaveProperty('valid', false);
  });

  it('validateStringInput - valid input', () => {
    expect(validateStringInput('hello')).toEqual({ valid: true });
  });

  it('formatResponse - array and object handling', () => {
    const arrResp = formatResponse({ success: true, data: [{ id: '1', content: 'a' }, 'b'] });
    expect(arrResp).toHaveProperty('type', 'array');
    expect(arrResp).toHaveProperty('count', 2);

    const objResp = formatResponse({ success: true, data: { id: 'x', content: 'ok' } });
    expect(objResp).toHaveProperty('type', 'object');
    expect(objResp.data).toHaveProperty('id', 'x');

    const primResp = formatResponse({ success: true, data: 42 });
    expect(primResp).toHaveProperty('type', 'primitive');
  });

  it('formatResponse - error and empty', () => {
    const err = formatResponse({ success: false, error: 'boom' });
    expect(err).toHaveProperty('type', 'error');

    const empty = formatResponse({ success: true });
    expect(empty).toHaveProperty('type', 'empty');
  });

  it('processDataArray and processDataObject', () => {
    const arr = [{ id: '1', value: 10 }, 5];
    const r = processDataArray(arr);
    expect(r).toHaveProperty('success', true);
    expect(r.data[0]).toHaveProperty('id', '1');
    expect(r.data[1]).toHaveProperty('id', 'item-1');

    const obj = { id: 'o1', value: 'v' };
    const pr = processDataObject(obj);
    expect(pr).toHaveProperty('success', true);
    expect(pr.data.value).toBe('v');
  });

  it('transformData - uppercase/lowercase/reverse', () => {
    expect(transformData('abc', 'uppercase')).toBe('ABC');
    expect(transformData(['a', 'b'], 'uppercase')[0]).toBe('A');
    expect(transformData('AbC', 'lowercase')).toBe('abc');
    expect(transformData('abc', 'reverse')).toBe('cba');
  });

  it('filterData - filtering operators', () => {
    const data = [{ a: 1 }, { a: 5 }, { a: 10 }];
    const filtered = filterData(data, { field: 'a', operator: 'greaterThan', value: 4 });
    expect(filtered.length).toBe(2);
  });

  it('sendAgentRequest - success and network error', async () => {
    axios.post.mockResolvedValue({ data: { result: { hello: 'world' }, metadata: { ver: 1 } } });
    const ok = await sendAgentRequest('search', 'hello');
    expect(ok).toHaveProperty('success', true);
    expect(ok.data).toEqual({ hello: 'world' });

    axios.post.mockRejectedValue({ request: true });
    const netErr = await sendAgentRequest('search', 'hello');
    expect(netErr).toHaveProperty('success', false);
    expect(netErr.error).toBe('Network error');
  });
});
