import { transformData as _transformData, processDataArray as _processDataArray, processDataObject as _processDataObject, filterData as _filterData } from './commonUtils';

export const convertToUppercase = (input) => _transformData(input, 'uppercase');
export const convertToLowercase = (input) => _transformData(input, 'lowercase');
export const reverseData = (input) => _transformData(input, 'reverse');
export const applyDataTransformation = (inputData, transformation) => _transformData(inputData, transformation);

export const handleArrayProcessing = (inputArray) => _processDataArray(inputArray);
export const handleObjectProcessing = (inputObject) => _processDataObject(inputObject);
export const applyFiltering = (dataArray, criteria) => _filterData(dataArray, criteria);

