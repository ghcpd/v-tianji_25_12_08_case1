import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

import * as common from '../src/utils/common';
import * as agentTools from '../src/utils/agentTools';
import * as requestHandler from '../src/utils/requestHandler';

vi.mock('axios');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('validateQuery', () => {
  it('returns invalid for short string', () => {
    const res = common.validateQuery('aa');
    expect(res.valid).toBe(false);
  });

  it('returns valid for acceptable string', () => {
    const res = common.validateQuery('hello world');
    expect(res.valid).toBe(true);
  });
});

describe('callAgentAPI', () => {
  it('returns success when axios returns result', async () => {
    axios.post.mockResolvedValue({ data: { result: { ok: true }, metadata: { x: 1 } } });
    const res = await common.callAgentAPI('search', 'query');
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ ok: true });
  });

  it('returns error on invalid format', async () => {
    axios.post.mockResolvedValue({ data: {} });
    const res = await common.callAgentAPI('search', 'query');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid response format');
  });

  it('returns network error when request fails', async () => {
    const error = { request: true };
    axios.post.mockRejectedValue(error);
    const res = await common.callAgentAPI('search', 'query');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Network error');
  });
});

describe('formatAgentResponse', () => {
  it('formats array responses', () => {
    const response = { success: true, data: [{ id: 1, content: 'a' }, 'b'] };
    const out = common.formatAgentResponse(response);
    expect(out.type).toBe('array');
    expect(out.count).toBe(2);
  });

  it('formats object responses', () => {
    const response = { success: true, data: { id: 'abc', content: 'hello' } };
    const out = common.formatAgentResponse(response);
    expect(out.type).toBe('object');
    expect(out.data.id).toBe('abc');
  });

  it('formats error responses', () => {
    const response = { success: false, error: 'oops' };
    const out = common.formatAgentResponse(response);
    expect(out.type).toBe('error');
    expect(out.data.content).toBe('oops');
  });
});

describe('getAgentToolStatus', () => {
  it('returns active for search/analyze/transform', () => {
    expect(common.getAgentToolStatus('search').status).toBe('active');
    expect(common.getAgentToolStatus('analyze').status).toBe('active');
    expect(common.getAgentToolStatus('transform').status).toBe('active');
  });
});

describe('data processing and transform utilities', () => {
  it('processDataArray handles mixed types', () => {
    const input = [{ id: 1, value: 10 }, 5, null];
    const out = common.processDataArray(input);
    expect(out.success).toBe(true);
    expect(out.data.length).toBe(3);
    expect(out.data[0].id).toBe(1);
  });

  it('processDataObject returns processed object', () => {
    const out = common.processDataObject({ value: 'v' });
    expect(out.success).toBe(true);
    expect(out.data.processed).toBe(true);
  });

  it('transformData uppercase and lowercase and reverse', () => {
    expect(common.transformData('abc', 'uppercase')).toBe('ABC');
    expect(common.transformData('AbC', 'lowercase')).toBe('abc');
    const arr = ['a', 'b', 'c'];
    expect(common.transformData(arr, 'reverse')).toEqual(['c', 'b', 'a']);
  });

  it('filterData works with operators', () => {
    const data = [{ v: 'hello' }, { v: 'world' }, { v: 'hello world' }];
    expect(common.filterData(data, { field: 'v', operator: 'contains', value: 'hello' }).length).toBe(2);
    expect(common.filterData(data, { field: 'v', operator: 'equals', value: 'world' }).length).toBe(1);
  });
});

describe('backwards compatibility', () => {
  it('agentTools re-exports validateAgentInput', () => {
    expect(typeof agentTools.validateAgentInput).toBe('function');
    expect(agentTools.validateAgentInput('hello world').valid).toBe(true);
  });

  it('requestHandler functions call common', async () => {
    axios.post.mockResolvedValue({ data: { result: { x: 1 } } });
    const res = await requestHandler.sendAgentRequest('search', 'abc');
    expect(res.success).toBe(true);
    const res2 = await requestHandler.makeAgentCall('search', 'abc');
    expect(res2.success).toBe(true);
  });
});
