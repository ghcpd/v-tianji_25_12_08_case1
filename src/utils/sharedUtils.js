import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function validateStringInput(str) {
  if (!str) return { valid: false, error: 'Input is required' };
  if (typeof str !== 'string') return { valid: false, error: 'Input must be a string' };
  if (str.length < 3) return { valid: false, error: 'Input must be at least 3 characters' };
  if (str.length > 100) return { valid: false, error: 'Input must be less than 100 characters' };
  return { valid: true };
}

export async function sendAgentRequest(toolName, query, options = {}) {
  try {
    const validation = validateStringInput(query);
    if (!validation.valid) return { success: false, error: 'Invalid query parameter' };

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

export function formatResponse(response) {
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
                id: item.id || item._id || generateId(),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || new Date().toISOString()
              };
            }
            return { id: generateId(), content: String(item), timestamp: new Date().toISOString() };
          })
        };
      }

      if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: {
            id: response.data.id || response.data._id || generateId(),
            content: response.data.content || response.data.text || response.data.name || JSON.stringify(response.data),
            timestamp: response.data.timestamp || response.data.createdAt || new Date().toISOString()
          }
        };
      }

      return {
        formatted: true,
        type: 'primitive',
        data: { id: generateId(), content: String(response.data), timestamp: new Date().toISOString() }
      };
    }

    return {
      formatted: true,
      type: 'empty',
      data: { id: generateId(), content: 'No data available', timestamp: new Date().toISOString() }
    };
  }

  return {
    formatted: true,
    type: 'error',
    data: { id: generateId(), content: response.error || 'Unknown error', timestamp: new Date().toISOString() }
  };
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
  const processed = {
    id: obj.id || obj._id || generateId(),
    value: obj.value || obj.data || obj.content || '',
    timestamp: obj.timestamp || obj.createdAt || new Date().toISOString(),
    processed: true
  };
  return { success: true, data: processed };
}

export function transformData(data, transformType) {
  if (transformType === 'uppercase') {
    if (typeof data === 'string') return data.toUpperCase();
    if (Array.isArray(data)) return data.map(item => {
      if (typeof item === 'string') return item.toUpperCase();
      if (item && typeof item === 'object' && item.value) return { ...item, value: String(item.value).toUpperCase() };
      return item;
    });
    if (data && typeof data === 'object' && data.value) return { ...data, value: String(data.value).toUpperCase() };
    return data;
  }

  if (transformType === 'lowercase') {
    if (typeof data === 'string') return data.toLowerCase();
    if (Array.isArray(data)) return data.map(item => {
      if (typeof item === 'string') return item.toLowerCase();
      if (item && typeof item === 'object' && item.value) return { ...item, value: String(item.value).toLowerCase() };
      return item;
    });
    if (data && typeof data === 'object' && data.value) return { ...data, value: String(data.value).toLowerCase() };
    return data;
  }

  if (transformType === 'reverse') {
    if (typeof data === 'string') return data.split('').reverse().join('');
    if (Array.isArray(data)) return data.slice().reverse();
    return data;
  }

  return data;
}

export function filterData(data, filterCriteria = {}) {
  if (!Array.isArray(data)) return data;
  return data.filter(item => {
    if (filterCriteria.field && filterCriteria.value != null) {
      if (item && typeof item === 'object') {
        const fieldValue = item[filterCriteria.field];
        if (filterCriteria.operator === 'equals') return fieldValue === filterCriteria.value;
        if (filterCriteria.operator === 'contains') return String(fieldValue).includes(String(filterCriteria.value));
        if (filterCriteria.operator === 'greaterThan') return Number(fieldValue) > Number(filterCriteria.value);
        if (filterCriteria.operator === 'lessThan') return Number(fieldValue) < Number(filterCriteria.value);
      }
      return false;
    }
    return true;
  });
}

export function getToolStatus(toolName) {
  const statuses = ['active', 'inactive', 'maintenance', 'error'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  if (toolName === 'search' || toolName === 'analyze' || toolName === 'transform') {
    return { status: 'active', lastChecked: new Date().toISOString() };
  }
  return { status: randomStatus, lastChecked: new Date().toISOString() };
}
