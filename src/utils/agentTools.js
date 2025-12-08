import { validateStringInput, postAgentRequest, formatResponse, getToolStatus } from './commonUtils';

// Keep previous names for backwards-compatibility
export const validateAgentInput = validateStringInput;
export const validateAgentInput2 = validateStringInput;
export const validateAgentInput3 = validateStringInput;

export async function executeAgentTool(toolName, params) {
  const validation = validateStringInput(params?.query);
  if (!validation.valid) return { success: false, error: validation.error };
  return postAgentRequest(toolName, params.query, params.options || {});
}

// Backwards-compatible alias
export const executeAgentTool2 = executeAgentTool;

export async function processAgentRequest(requestData) {
  const toolName = requestData?.tool;
  const params = requestData?.params;
  if (!toolName) return { success: false, error: 'Tool name is required' };
  if (!params || !params.query) return { success: false, error: 'Query parameter is required' };
  const validation = validateStringInput(params.query);
  if (!validation.valid) return { success: false, error: validation.error };
  return executeAgentTool(toolName, params);
}

export const processAgentRequest2 = processAgentRequest;

export const formatAgentResponse = formatResponse;

export const formatAgentResponse2 = formatAgentResponse;

export const getAgentToolStatus = getToolStatus;
export const getAgentToolStatus2 = getToolStatus;

