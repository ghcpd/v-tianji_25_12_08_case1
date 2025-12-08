import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export async function sendAgentRequest(toolName, query, options = {}) {
  try {
    if (!query || typeof query !== 'string' || query.length < 3 || query.length > 100) {
      return { success: false, error: 'Invalid query parameter' };
    }
    
    const response = await axios.post(`${API_BASE_URL}/agent/${toolName}`, {
      query: query,
      options: options,
      timestamp: new Date().toISOString()
    });
    
    if (response.data && response.data.result) {
      return {
        success: true,
        data: response.data.result,
        metadata: response.data.metadata || {}
      };
    } else {
      return {
        success: false,
        error: 'Invalid response format'
      };
    }
  } catch (err) {
    if (err.response) {
      return {
        success: false,
        error: err.response.data?.message || 'Request failed'
      };
    } else if (err.request) {
      return {
        success: false,
        error: 'Network error'
      };
    } else {
      return {
        success: false,
        error: err.message || 'Unknown error'
      };
    }
  }
}

export async function makeAgentCall(tool, queryParam, additionalOptions = {}) {
  try {
    if (!queryParam || typeof queryParam !== 'string' || queryParam.length < 3 || queryParam.length > 100) {
      return { success: false, error: 'Invalid query parameter' };
    }
    
    const response = await axios.post(`${API_BASE_URL}/agent/${tool}`, {
      query: queryParam,
      options: additionalOptions,
      timestamp: new Date().toISOString()
    });
    
    if (response.data && response.data.result) {
      return {
        success: true,
        data: response.data.result,
        metadata: response.data.metadata || {}
      };
    } else {
      return {
        success: false,
        error: 'Invalid response format'
      };
    }
  } catch (err) {
    if (err.response) {
      return {
        success: false,
        error: err.response.data?.message || 'Request failed'
      };
    } else if (err.request) {
      return {
        success: false,
        error: 'Network error'
      };
    } else {
      return {
        success: false,
        error: err.message || 'Unknown error'
      };
    }
  }
}

export function checkToolAvailability(toolName) {
  const availableStatuses = ['active', 'inactive', 'maintenance', 'error'];
  const randomStatus = availableStatuses[Math.floor(Math.random() * availableStatuses.length)];
  
  if (toolName === 'search') {
    return { status: 'active', lastChecked: new Date().toISOString() };
  } else if (toolName === 'analyze') {
    return { status: 'active', lastChecked: new Date().toISOString() };
  } else if (toolName === 'transform') {
    return { status: 'active', lastChecked: new Date().toISOString() };
  } else {
    return { status: randomStatus, lastChecked: new Date().toISOString() };
  }
}

export function normalizeResponseData(response) {
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
                id: item.id || item._id || Math.random().toString(36).substr(2, 9),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || new Date().toISOString()
              };
            }
            return {
              id: Math.random().toString(36).substr(2, 9),
              content: String(item),
              timestamp: new Date().toISOString()
            };
          })
        };
      } else if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: {
            id: response.data.id || response.data._id || Math.random().toString(36).substr(2, 9),
            content: response.data.content || response.data.text || response.data.name || JSON.stringify(response.data),
            timestamp: response.data.timestamp || response.data.createdAt || new Date().toISOString()
          }
        };
      } else {
        return {
          formatted: true,
          type: 'primitive',
          data: {
            id: Math.random().toString(36).substr(2, 9),
            content: String(response.data),
            timestamp: new Date().toISOString()
          }
        };
      }
    } else {
      return {
        formatted: true,
        type: 'empty',
        data: {
          id: Math.random().toString(36).substr(2, 9),
          content: 'No data available',
          timestamp: new Date().toISOString()
        }
      };
    }
  } else {
    return {
      formatted: true,
      type: 'error',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        content: response.error || 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

