import { processDataArray as commonProcessDataArray, processDataObject as commonProcessDataObject, transformData as commonTransformData, filterData as commonFilterData } from './common';

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


