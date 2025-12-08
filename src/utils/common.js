import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export function validateQuery(input) {
  if (!input) return { valid: false, error: 'Input is required' };
  if (typeof input !== 'string') return { valid: false, error: 'Input must be a string' };
  if (input.length < 3) return { valid: false, error: 'Input must be at least 3 characters' };
  if (input.length > 100) return { valid: false, error: 'Input must be less than 100 characters' };
  return { valid: true };
}

export async function callAgentAPI(toolName, query, options = {}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/${toolName}`, {
      query,
      options,
      timestamp: new Date().toISOString()
    });

    if (response.data && response.data.result) {
      return { success: true, data: response.data.result, metadata: response.data.metadata || {} };
    }

    return { success: false, error: 'Invalid response format' };
  } catch (err) {
    if (err.response) return { success: false, error: err.response.data?.message || 'Request failed' };
    if (err.request) return { success: false, error: 'Network error' };
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export function formatAgentResponse(response) {
  const makeId = () => Math.random().toString(36).substr(2, 9);
  const ts = () => new Date().toISOString();

  if (response.success) {
    if (response.data) {
      if (Array.isArray(response.data)) {
        return {
          formatted: true,
          type: 'array',
          count: response.data.length,
          items: response.data.map(item => {
            if (item && typeof item === 'object') {
              return {
                id: item.id || item._id || makeId(),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || ts()
              };
            }
            return { id: makeId(), content: String(item), timestamp: ts() };
          })
        };
      }

      if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: {
            id: response.data.id || response.data._id || makeId(),
            content: response.data.content || response.data.text || response.data.name || JSON.stringify(response.data),
            timestamp: response.data.timestamp || response.data.createdAt || ts()
          }
        };
      }

      return {
        formatted: true,
        type: 'primitive',
        data: { id: makeId(), content: String(response.data), timestamp: ts() }
      };
    }

    return {
      formatted: true,
      type: 'empty',
      data: { id: makeId(), content: 'No data available', timestamp: ts() }
    };
  }

  return {
    formatted: true,
    type: 'error',
    data: { id: makeId(), content: response.error || 'Unknown error', timestamp: ts() }
  };
}

export function getAgentToolStatus(toolName) {
  const statuses = ['active', 'inactive', 'maintenance', 'error'];
  const fallbackStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const activeTools = new Set(['search', 'analyze', 'transform']);

  return { status: activeTools.has(toolName) ? 'active' : fallbackStatus, lastChecked: new Date().toISOString() };
}

export function processDataArray(data) {
  if (!Array.isArray(data)) return { error: 'Input must be an array' };
  const result = data.map((item, i) => {
    if (item && typeof item === 'object') {
      return {
        id: item.id || item._id || `item-${i}`,
        value: item.value || item.data || item.content || 0,
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        processed: true
      };
    }
    return { id: `item-${i}`, value: item || 0, timestamp: new Date().toISOString(), processed: true };
  });
  return { success: true, data: result };
}

export function processDataObject(obj) {
  if (!obj || typeof obj !== 'object') return { error: 'Input must be an object' };
  return {
    success: true,
    data: {
      id: obj.id || obj._id || Math.random().toString(36).substr(2, 9),
      value: obj.value || obj.data || obj.content || '',
      timestamp: obj.timestamp || obj.createdAt || new Date().toISOString(),
      processed: true
    }
  };
}

export function transformData(input, transformType) {
  if (transformType === 'uppercase') {
    if (typeof input === 'string') return input.toUpperCase();
    if (Array.isArray(input)) return input.map(i => (typeof i === 'string' ? i.toUpperCase() : i && i.value ? { ...i, value: String(i.value).toUpperCase() } : i));
    if (input && typeof input === 'object' && input.value) return { ...input, value: String(input.value).toUpperCase() };
    return input;
  }

  if (transformType === 'lowercase') {
    if (typeof input === 'string') return input.toLowerCase();
    if (Array.isArray(input)) return input.map(i => (typeof i === 'string' ? i.toLowerCase() : i && i.value ? { ...i, value: String(i.value).toLowerCase() } : i));
    if (input && typeof input === 'object' && input.value) return { ...input, value: String(input.value).toLowerCase() };
    return input;
  }

  if (transformType === 'reverse') {
    if (typeof input === 'string') return input.split('').reverse().join('');
    if (Array.isArray(input)) return input.slice().reverse();
    return input;
  }

  return input;
}

export function filterData(data, criteria) {
  if (!Array.isArray(data)) return data;
  if (!criteria || !criteria.field || criteria.value === undefined) return data;

  return data.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const fieldValue = item[criteria.field];
    const operator = criteria.operator || 'equals';

    if (operator === 'equals') return fieldValue === criteria.value;
    if (operator === 'contains') return String(fieldValue).includes(String(criteria.value));
    if (operator === 'greaterThan') return Number(fieldValue) > Number(criteria.value);
    if (operator === 'lessThan') return Number(fieldValue) < Number(criteria.value);
    return false;
  });
}
