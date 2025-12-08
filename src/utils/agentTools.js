import axios from 'axios';
import { validateStringInput } from './validationHelpers';
import { formatResponse } from './responseFormatters';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Legacy alias for validateStringInput (backward compatibility)
 */
export const validateAgentInput = validateStringInput;

/**
 * Executes an agent tool with the specified parameters
 * @param {string} toolName - Name of the tool to execute
 * @param {object} params - Parameters including query and optional options
 * @returns {Promise<object>} Result object with success flag and data or error
 */
export async function executeAgentTool(toolName, params) {
  try {
    const validation = validateStringInput(params.query);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    const response = await axios.post(`${API_BASE_URL}/agent/${toolName}`, {
      query: params.query,
      options: params.options || {},
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
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Request failed'
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network error'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }
}

/**
 * Processes an agent request with validation and execution
 * @param {object} requestData - Request object with tool name and params
 * @returns {Promise<object>} Processing result
 */
export async function processAgentRequest(requestData) {
  const toolName = requestData.tool;
  const params = requestData.params;
  
  if (!toolName) {
    return { success: false, error: 'Tool name is required' };
  }
  
  if (!params || !params.query) {
    return { success: false, error: 'Query parameter is required' };
  }
  
  const validation = validateStringInput(params.query);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  
  try {
    const result = await executeAgentTool(toolName, params);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process request'
    };
  }
}

/**
 * Legacy alias for formatResponse (backward compatibility)
 */
export const formatAgentResponse = formatResponse;

/**
 * Gets the status of an agent tool (mocked)
 * @param {string} toolName - The tool name
 * @returns {object} Tool status information
 */
export function getAgentToolStatus(toolName) {
  const knownTools = {
    'search': 'active',
    'analyze': 'active',
    'transform': 'active'
  };
  
  const status = knownTools[toolName] || 'active';
  return { status, lastChecked: new Date().toISOString() };
}

