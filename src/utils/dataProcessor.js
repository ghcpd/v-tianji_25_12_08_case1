/**
 * Normalizes an item by extracting standard fields
 * @param {*} item - The item to normalize
 * @param {number} index - Index for fallback ID
 * @returns {object} Normalized item with id, value, timestamp, processed flag
 */
function normalizeItem(item, index = 0) {
  if (item && typeof item === 'object') {
    return {
      id: item.id || item._id || `item-${index}`,
      value: item.value || item.data || item.content || 0,
      timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
      processed: true
    };
  }
  return {
    id: `item-${index}`,
    value: item || 0,
    timestamp: new Date().toISOString(),
    processed: true
  };
}

/**
 * Processes an array of data items
 * @param {Array} data - The array to process
 * @returns {object} Result object with success flag and processed data
 */
export function processDataArray(data) {
  if (!Array.isArray(data)) {
    return { error: 'Input must be an array' };
  }
  
  const result = data.map((item, i) => normalizeItem(item, i));
  return { success: true, data: result };
}

/**
 * Processes a single data object
 * @param {object} obj - The object to process
 * @returns {object} Result object with success flag and processed data
 */
export function processDataObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return { error: 'Input must be an object' };
  }
  
  const processed = {
    id: obj.id || obj._id || Math.random().toString(36).substr(2, 9),
    value: obj.value || obj.data || obj.content || '',
    timestamp: obj.timestamp || obj.createdAt || new Date().toISOString(),
    processed: true
  };
  
  return { success: true, data: processed };
}

/**
 * Applies case transformation (uppercase/lowercase) to data
 * @param {*} data - The data to transform
 * @param {string} transformType - 'uppercase' or 'lowercase'
 * @returns {*} Transformed data
 */
function applyCaseTransformation(data, transformType) {
  const toUpperCase = transformType === 'uppercase';
  const transform = toUpperCase ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
  
  if (typeof data === 'string') {
    return transform(data);
  } else if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        return transform(item);
      } else if (item && typeof item === 'object' && item.value) {
        return { ...item, value: transform(String(item.value)) };
      }
      return item;
    });
  } else if (data && typeof data === 'object' && data.value) {
    return { ...data, value: transform(String(data.value)) };
  }
  return data;
}

/**
 * Transforms data using the specified transformation type
 * @param {*} data - The data to transform
 * @param {string} transformType - 'uppercase', 'lowercase', or 'reverse'
 * @returns {*} Transformed data
 */
export function transformData(data, transformType) {
  if (transformType === 'uppercase' || transformType === 'lowercase') {
    return applyCaseTransformation(data, transformType);
  } else if (transformType === 'reverse') {
    if (typeof data === 'string') {
      return data.split('').reverse().join('');
    } else if (Array.isArray(data)) {
      return data.slice().reverse();
    }
    return data;
  }
  return data;
}

/**
 * Filters array data based on criteria
 * @param {Array} data - The data to filter
 * @param {object} filterCriteria - Filter criteria object with field, operator, and value
 * @returns {Array} Filtered data
 */
export function filterData(data, filterCriteria) {
  if (Array.isArray(data)) {
    return data.filter(item => {
      if (filterCriteria.field && filterCriteria.value !== undefined) {
        if (item && typeof item === 'object') {
          const fieldValue = item[filterCriteria.field];
          switch (filterCriteria.operator) {
            case 'equals':
              return fieldValue === filterCriteria.value;
            case 'contains':
              return String(fieldValue).includes(String(filterCriteria.value));
            case 'greaterThan':
              return Number(fieldValue) > Number(filterCriteria.value);
            case 'lessThan':
              return Number(fieldValue) < Number(filterCriteria.value);
            default:
              return false;
          }
        }
        return false;
      }
      return true;
    });
  }
  return data;
}

