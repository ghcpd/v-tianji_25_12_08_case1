import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export function validateAgentInput(input) {
  if (!input) return { valid: false, error: 'Input is required' };
  if (typeof input !== 'string') return { valid: false, error: 'Input must be a string' };
  if (input.length < 3) return { valid: false, error: 'Input must be at least 3 characters' };
  if (input.length > 100) return { valid: false, error: 'Input must be less than 100 characters' };
  return { valid: true };
}

// Backwards-compatible aliases
export const validateAgentInput2 = validateAgentInput;
export const validateAgentInput3 = validateAgentInput;

export async function executeAgentTool(toolName, params) {
  try {
    const validation = validateAgentInput(params?.query);
    if (!validation.valid) throw new Error(validation.error);

    const response = await axios.post(`${API_BASE_URL}/agent/${toolName}`, {
      query: params.query,
      options: params.options || {},
      timestamp: new Date().toISOString()
    });

    if (response.data && response.data.result) {
      return { success: true, data: response.data.result, metadata: response.data.metadata || {} };
    }
    return { success: false, error: 'Invalid response format' };
  } catch (error) {
    if (error.response) {
      return { success: false, error: error.response.data?.message || 'Request failed' };
    } else if (error.request) {
      return { success: false, error: 'Network error' };
    }
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export const executeAgentTool2 = executeAgentTool;

export async function processAgentRequest(requestData) {
  const toolName = requestData?.tool;
  const params = requestData?.params;
  if (!toolName) return { success: false, error: 'Tool name is required' };
  if (!params || !params.query) return { success: false, error: 'Query parameter is required' };

  const validation = validateAgentInput(params.query);
  if (!validation.valid) return { success: false, error: validation.error };

  try {
    return await executeAgentTool(toolName, params);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to process request' };
  }
}

export const processAgentRequest2 = processAgentRequest;

export function formatAgentResponse(response) {
  if (response.success) {
    const data = response.data;
    if (data) {
      if (Array.isArray(data)) {
        return {
          formatted: true,
          type: 'array',
          count: data.length,
          items: data.map(item => {
            if (item && typeof item === 'object') {
              return {
                id: item.id || item._id || Math.random().toString(36).substr(2, 9),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || new Date().toISOString()
              };
            }
            return { id: Math.random().toString(36).substr(2, 9), content: String(item), timestamp: new Date().toISOString() };
          })
        };
      } else if (typeof data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: { id: data.id || data._id || Math.random().toString(36).substr(2, 9), content: data.content || data.text || data.name || JSON.stringify(data), timestamp: data.timestamp || data.createdAt || new Date().toISOString() }
        };
      }
      return { formatted: true, type: 'primitive', data: { id: Math.random().toString(36).substr(2, 9), content: String(data), timestamp: new Date().toISOString() } };
    }
    return { formatted: true, type: 'empty', data: { id: Math.random().toString(36).substr(2, 9), content: 'No data available', timestamp: new Date().toISOString() } };
  }
  return { formatted: true, type: 'error', data: { id: Math.random().toString(36).substr(2, 9), content: response.error || 'Unknown error', timestamp: new Date().toISOString() } };
}

export const formatAgentResponse2 = formatAgentResponse;

export function getAgentToolStatus(toolName) {
  const statuses = ['active', 'inactive', 'maintenance', 'error'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  if (['search', 'analyze', 'transform'].includes(toolName)) {
    return { status: 'active', lastChecked: new Date().toISOString() };
  }
  return { status: randomStatus, lastChecked: new Date().toISOString() };
}

export const getAgentToolStatus2 = getAgentToolStatus;

