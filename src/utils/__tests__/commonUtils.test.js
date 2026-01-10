import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

import {
  validateStringInput,
  postAgentRequest,
  formatResponse,
  transformData,
  processDataArray,
  processDataObject,
  filterData
} from '../commonUtils';

vi.mock('axios');

describe('commonUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validateStringInput - handles invalid and valid values', () => {
    expect(validateStringInput('')).toEqual({ valid: false, error: 'Input is required' });
    expect(validateStringInput(123)).toEqual({ valid: false, error: 'Input must be a string' });
    expect(validateStringInput('ab')).toEqual({ valid: false, error: 'Input must be at least 3 characters' });
    expect(validateStringInput('a'.repeat(101))).toEqual({ valid: false, error: 'Input must be less than 100 characters' });
    expect(validateStringInput('hello')).toEqual({ valid: true });
  });

  it('postAgentRequest - returns success for valid axios response', async () => {
    axios.post.mockResolvedValue({ data: { result: ['ok'], metadata: { k: 'v' } } });
    const res = await postAgentRequest('search', 'x', { foo: 1 });
    expect(res.success).toBe(true);
    expect(res.data).toEqual(['ok']);
    expect(res.metadata).toEqual({ k: 'v' });
  });

  it('postAgentRequest - handles response format errors', async () => {
    axios.post.mockResolvedValue({ data: {} });
    const res = await postAgentRequest('search', 'x');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid response format');
  });

  it('postAgentRequest - handles axios errors (response)', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'bad' } } });
    const res = await postAgentRequest('search', 'x');
    expect(res.success).toBe(false);
    expect(res.error).toBe('bad');
  });

  it('formatResponse - formats array/object/primitive/empty/error', () => {
    const arr = { success: true, data: [{ id: '1', content: 'c' }] };
    const out1 = formatResponse(arr);
    expect(out1.type).toBe('array');
    const obj = { success: true, data: { id: '2', content: 'o' } };
    const out2 = formatResponse(obj);
    expect(out2.type).toBe('object');
    const prim = { success: true, data: 5 };
    expect(formatResponse(prim).type).toBe('primitive');
    const empty = { success: true };
    expect(formatResponse(empty).type).toBe('empty');
    const err = { success: false, error: 'x' };
    expect(formatResponse(err).type).toBe('error');
  });

  it('transformData - uppercase/lowercase/reverse across types', () => {
    expect(transformData('ab', 'uppercase')).toBe('AB');
    expect(transformData(['a', 'b'], 'uppercase')).toEqual(['A', 'B']);
    expect(transformData({ value: 'a' }, 'uppercase').value).toBe('A');
    expect(transformData('ABC', 'lowercase')).toBe('abc');
    expect(transformData(['A', { value: 'B' }], 'lowercase')).toEqual(['a', { value: 'b' }]);
    expect(transformData('abc', 'reverse')).toBe('cba');
    expect(transformData(['1', '2', '3'], 'reverse')).toEqual(['3', '2', '1']);
  });

  it('processDataArray/object - normalizes shapes', () => {
    const arrRes = processDataArray([{ id: '1', value: 3 }, 4]);
    expect(arrRes.success).toBe(true);
    expect(Array.isArray(arrRes.data)).toBe(true);
    expect(arrRes.data[0].id).toBe('1');

    const objRes = processDataObject({ id: 'x', value: 'v' });
    expect(objRes.success).toBe(true);
    expect(objRes.data.value).toBe('v');
  });

  it('filterData - filters by equals, contains, greaterThan, lessThan', () => {
    const data = [
      { id: 1, name: 'alpha', score: 10 },
      { id: 2, name: 'beta', score: 5 }
    ];

    expect(filterData(data, { field: 'name', operator: 'equals', value: 'alpha' })).toHaveLength(1);
    expect(filterData(data, { field: 'name', operator: 'contains', value: 'et' })).toHaveLength(1);
    expect(filterData(data, { field: 'score', operator: 'greaterThan', value: 6 })).toHaveLength(1);
    expect(filterData(data, { field: 'score', operator: 'lessThan', value: 6 })).toHaveLength(1);
  });
});
