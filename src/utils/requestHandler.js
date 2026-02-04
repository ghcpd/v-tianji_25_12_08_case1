import { sendAgentRequest, formatResponse, getToolStatus } from './sharedUtils';

export async function sendAgentRequestWrapper(toolName, query, options = {}) {
  return sendAgentRequest(toolName, query, options);
}

export const sendAgentRequest = sendAgentRequestWrapper;
export const makeAgentCall = sendAgentRequestWrapper;

export const checkToolAvailability = getToolStatus;
export const normalizeResponseData = formatResponse;


