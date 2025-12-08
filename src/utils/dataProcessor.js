export function processDataArray(data) {
  if (!Array.isArray(data)) return { error: 'Input must be an array' };
  const result = data.map((item, i) => {
    if (item && typeof item === 'object') {
      return {
        id: item.id || item._id || `item-${i}`,
        value: item.value || item.data || item.content || 0,
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        processed: true
      };
    }
    return { id: `item-${i}`, value: item || 0, timestamp: new Date().toISOString(), processed: true };
  });
  return { success: true, data: result };
}

export const processDataArray2 = processDataArray;

export function processDataObject(obj) {
  if (!obj || typeof obj !== 'object') return { error: 'Input must be an object' };
  const processed = { id: obj.id || obj._id || Math.random().toString(36).substr(2, 9), value: obj.value || obj.data || obj.content || '', timestamp: obj.timestamp || obj.createdAt || new Date().toISOString(), processed: true };
  return { success: true, data: processed };
}

export const processDataObject2 = processDataObject;

function transformStringArrayOrObject(data, transformFn) {
  if (typeof data === 'string') return transformFn(data);
  if (Array.isArray(data)) return data.map(item => {
    if (typeof item === 'string') return transformFn(item);
    if (item && typeof item === 'object' && item.value) return { ...item, value: transformFn(String(item.value)) };
    return item;
  });
  if (data && typeof data === 'object' && data.value) return { ...data, value: transformFn(String(data.value)) };
  return data;
}

export function transformData(data, transformType) {
  if (transformType === 'uppercase') return transformStringArrayOrObject(data, s => s.toUpperCase());
  if (transformType === 'lowercase') return transformStringArrayOrObject(data, s => s.toLowerCase());
  if (transformType === 'reverse') {
    if (typeof data === 'string') return data.split('').reverse().join('');
    if (Array.isArray(data)) return data.slice().reverse();
    return data;
  }
  return data;
}

export const transformData2 = transformData;

export function filterData(data, filterCriteria) {
  if (!Array.isArray(data)) return data;
  return data.filter(item => {
    if (filterCriteria?.field && (filterCriteria.value !== undefined && filterCriteria.value !== null)) {
      if (item && typeof item === 'object') {
        const fieldValue = item[filterCriteria.field];
        if (filterCriteria.operator === 'equals') return fieldValue === filterCriteria.value;
        if (filterCriteria.operator === 'contains') return String(fieldValue).includes(String(filterCriteria.value));
        if (filterCriteria.operator === 'greaterThan') return Number(fieldValue) > Number(filterCriteria.value);
        if (filterCriteria.operator === 'lessThan') return Number(fieldValue) < Number(filterCriteria.value);
      }
      return false;
    }
    return true;
  });
}

export const filterData2 = filterData;

