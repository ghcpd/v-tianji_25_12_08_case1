import { validateStringInput, sendAgentRequest, formatResponse, getToolStatus } from './sharedUtils';

export const validateAgentInput = validateStringInput;
export const validateAgentInput2 = validateStringInput;
export const validateAgentInput3 = validateStringInput;

export async function executeAgentTool(toolName, params) {
  // Reuse shared sendAgentRequest to keep behavior consistent
  return sendAgentRequest(toolName, params.query, params.options || {});
}

export const executeAgentTool2 = executeAgentTool;

export async function processAgentRequest(requestData) {
  const toolName = requestData.tool;
  const params = requestData.params;
  if (!toolName) return { success: false, error: 'Tool name is required' };
  if (!params || !params.query) return { success: false, error: 'Query parameter is required' };
  const validation = validateAgentInput(params.query);
  if (!validation.valid) return { success: false, error: validation.error };
  return executeAgentTool(toolName, params);
}

export const processAgentRequest2 = processAgentRequest;

export const formatAgentResponse = formatResponse;
export const formatAgentResponse2 = formatResponse;

export const getAgentToolStatus = getToolStatus;
export const getAgentToolStatus2 = getToolStatus;


