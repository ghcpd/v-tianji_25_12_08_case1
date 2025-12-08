import { validateQuery, callAgentAPI, formatAgentResponse, getAgentToolStatus } from './common';

export async function sendAgentRequest(toolName, query, options = {}) {
  const validation = validateQuery(query);
  if (!validation.valid) return { success: false, error: validation.error };
  return callAgentAPI(toolName, query, options);
}

export async function makeAgentCall(tool, queryParam, additionalOptions = {}) {
  return sendAgentRequest(tool, queryParam, additionalOptions);
}

export function checkToolAvailability(toolName) {
  return getAgentToolStatus(toolName);
}

export function normalizeResponseData(response) {
  return formatAgentResponse(response);
}


