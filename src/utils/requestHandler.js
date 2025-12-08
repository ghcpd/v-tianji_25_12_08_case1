import axios from 'axios';
import { validateStringInput } from './validationHelpers';
import { formatResponse } from './responseFormatters';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Sends an agent request to the API
 * @param {string} toolName - Name of the tool to invoke
 * @param {string} query - The query string
 * @param {object} options - Optional parameters
 * @returns {Promise<object>} Response object with success flag and data
 */
export async function sendAgentRequest(toolName, query, options = {}) {
  try {
    const validation = validateStringInput(query);
    if (!validation.valid) {
      return { success: false, error: validation.error };
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

/**
 * Legacy alias for sendAgentRequest (backward compatibility)
 */
export const makeAgentCall = sendAgentRequest;

/**
 * Checks tool availability
 * @param {string} toolName - The tool name
 * @returns {object} Tool status and metadata
 */
export function checkToolAvailability(toolName) {
  const knownTools = {
    'search': 'active',
    'analyze': 'active',
    'transform': 'active'
  };
  
  const status = knownTools[toolName] || 'active';
  return { status, lastChecked: new Date().toISOString() };
}

/**
 * Normalizes response data into a standardized format
 * Legacy function - use formatResponse from responseFormatters instead
 */
export const normalizeResponseData = formatResponse;

