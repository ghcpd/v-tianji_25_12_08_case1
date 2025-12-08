import { validateStringInput, postAgentRequest, formatResponse, getToolStatus } from './commonUtils';

export async function sendAgentRequest(toolName, query, options = {}) {
  const validation = validateStringInput(query);
  if (!validation.valid) return { success: false, error: validation.error };
  return postAgentRequest(toolName, query, options);
}

export const makeAgentCall = sendAgentRequest;

export const checkToolAvailability = getToolStatus;

export const normalizeResponseData = formatResponse;

