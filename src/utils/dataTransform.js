// Re-export core functions from dataProcessor for backward compatibility
export {
  processDataArray as handleArrayProcessing,
  processDataObject as handleObjectProcessing,
  transformData as applyDataTransformation,
  filterData as applyFiltering
} from './dataProcessor';

