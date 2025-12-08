import axios from 'axios';
import { validateAgentInput, formatAgentResponse, getAgentToolStatus as _getAgentToolStatus } from './agentTools';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

async function postToAgent(toolName, query, options = {}) {
  const response = await axios.post(`${API_BASE_URL}/agent/${toolName}`, {
    query,
    options,
    timestamp: new Date().toISOString()
  });
  if (response.data && response.data.result) return { success: true, data: response.data.result, metadata: response.data.metadata || {} };
  return { success: false, error: 'Invalid response format' };
}

export async function sendAgentRequest(toolName, query, options = {}) {
  try {
    const validation = validateAgentInput(query);
    if (!validation.valid) return { success: false, error: 'Invalid query parameter' };
    return await postToAgent(toolName, query, options);
  } catch (err) {
    if (err.response) return { success: false, error: err.response.data?.message || 'Request failed' };
    if (err.request) return { success: false, error: 'Network error' };
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export const makeAgentCall = sendAgentRequest;

export function checkToolAvailability(toolName) {
  return _getAgentToolStatus(toolName);
}

export const normalizeResponseData = formatAgentResponse;

