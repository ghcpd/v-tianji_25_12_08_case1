import { processDataArray as _processDataArray, processDataObject as _processDataObject, transformData as _transformData, filterData as _filterData } from './commonUtils';

export function processDataArray(data) {
  return _processDataArray(data);
}
export const processDataArray2 = _processDataArray;

export function processDataObject(obj) {
  return _processDataObject(obj);
}
export const processDataObject2 = _processDataObject;

export function transformData(data, transformType) {
  return _transformData(data, transformType);
}
export const transformData2 = _transformData;

export function filterData(data, filterCriteria) {
  return _filterData(data, filterCriteria);
}
export const filterData2 = _filterData;

