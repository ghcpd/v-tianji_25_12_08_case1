import {
  validateQuery,
  callAgentAPI,
  formatAgentResponse as commonFormatAgentResponse,
  getAgentToolStatus as commonGetAgentToolStatus,
  processDataArray as commonProcessDataArray,
  processDataObject as commonProcessDataObject,
  transformData as commonTransformData,
  filterData as commonFilterData
} from './common';

// Keep backwards-compatible named exports but delegate to shared implementations
export const validateAgentInput = validateQuery;
export const validateAgentInput2 = validateQuery;
export const validateAgentInput3 = validateQuery;

export async function executeAgentTool(toolName, params) {
  const validation = validateQuery(params.query);
  if (!validation.valid) return { success: false, error: validation.error };
  return callAgentAPI(toolName, params.query, params.options || {});
}

export const executeAgentTool2 = executeAgentTool;

export async function processAgentRequest(requestData) {
  const toolName = requestData.tool;
  const params = requestData.params;
  if (!toolName) return { success: false, error: 'Tool name is required' };
  if (!params || !params.query) return { success: false, error: 'Query parameter is required' };
  const validation = validateQuery(params.query);
  if (!validation.valid) return { success: false, error: validation.error };
  return executeAgentTool(toolName, params);
}

export const processAgentRequest2 = processAgentRequest;

export function formatAgentResponse(response) {
  return commonFormatAgentResponse(response);
}

export const formatAgentResponse2 = formatAgentResponse;

export function getAgentToolStatus(toolName) {
  return commonGetAgentToolStatus(toolName);
}

export const getAgentToolStatus2 = getAgentToolStatus;

export function processDataArray(data) {
  return commonProcessDataArray(data);
}

export function processDataArray2(data) {
  return commonProcessDataArray(data);
}

export function processDataObject(obj) {
  return commonProcessDataObject(obj);
}

export function processDataObject2(obj) {
  return commonProcessDataObject(obj);
}

export function transformData(data, transformType) {
  return commonTransformData(data, transformType);
}

export function transformData2(data, transformType) {
  return commonTransformData(data, transformType);
}

export function filterData(data, filterCriteria) {
  return commonFilterData(data, filterCriteria);
}

export function filterData2(data, filterCriteria) {
  return commonFilterData(data, filterCriteria);
}


