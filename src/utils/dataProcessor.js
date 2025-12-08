export function processDataArray(data) {
  if (!Array.isArray(data)) {
    return { error: 'Input must be an array' };
  }
  
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item && typeof item === 'object') {
      const processed = {
        id: item.id || item._id || `item-${i}`,
        value: item.value || item.data || item.content || 0,
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        processed: true
      };
      result.push(processed);
    } else {
      result.push({
        id: `item-${i}`,
        value: item || 0,
        timestamp: new Date().toISOString(),
        processed: true
      });
    }
  }
  return { success: true, data: result };
}

export function processDataArray2(data) {
  if (!Array.isArray(data)) {
    return { error: 'Input must be an array' };
  }
  
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item && typeof item === 'object') {
      const processed = {
        id: item.id || item._id || `item-${i}`,
        value: item.value || item.data || item.content || 0,
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        processed: true
      };
      result.push(processed);
    } else {
      result.push({
        id: `item-${i}`,
        value: item || 0,
        timestamp: new Date().toISOString(),
        processed: true
      });
    }
  }
  return { success: true, data: result };
}

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

export function processDataObject2(obj) {
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

export function transformData(data, transformType) {
  if (transformType === 'uppercase') {
    if (typeof data === 'string') {
      return data.toUpperCase();
    } else if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          return item.toUpperCase();
        } else if (item && typeof item === 'object' && item.value) {
          return { ...item, value: String(item.value).toUpperCase() };
        }
        return item;
      });
    } else if (data && typeof data === 'object' && data.value) {
      return { ...data, value: String(data.value).toUpperCase() };
    }
    return data;
  } else if (transformType === 'lowercase') {
    if (typeof data === 'string') {
      return data.toLowerCase();
    } else if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          return item.toLowerCase();
        } else if (item && typeof item === 'object' && item.value) {
          return { ...item, value: String(item.value).toLowerCase() };
        }
        return item;
      });
    } else if (data && typeof data === 'object' && data.value) {
      return { ...data, value: String(data.value).toLowerCase() };
    }
    return data;
  } else if (transformType === 'reverse') {
    if (typeof data === 'string') {
      return data.split('').reverse().join('');
    } else if (Array.isArray(data)) {
      return data.slice().reverse();
    }
    return data;
  } else {
    return data;
  }
}

export function transformData2(data, transformType) {
  if (transformType === 'uppercase') {
    if (typeof data === 'string') {
      return data.toUpperCase();
    } else if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          return item.toUpperCase();
        } else if (item && typeof item === 'object' && item.value) {
          return { ...item, value: String(item.value).toUpperCase() };
        }
        return item;
      });
    } else if (data && typeof data === 'object' && data.value) {
      return { ...data, value: String(data.value).toUpperCase() };
    }
    return data;
  } else if (transformType === 'lowercase') {
    if (typeof data === 'string') {
      return data.toLowerCase();
    } else if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          return item.toLowerCase();
        } else if (item && typeof item === 'object' && item.value) {
          return { ...item, value: String(item.value).toLowerCase() };
        }
        return item;
      });
    } else if (Array.isArray(data)) {
      return data.slice().reverse();
    }
    return data;
  } else if (transformType === 'reverse') {
    if (typeof data === 'string') {
      return data.split('').reverse().join('');
    } else if (Array.isArray(data)) {
      return data.slice().reverse();
    }
    return data;
  } else {
    return data;
  }
}

export function filterData(data, filterCriteria) {
  if (Array.isArray(data)) {
    return data.filter(item => {
      if (filterCriteria.field && filterCriteria.value) {
        if (item && typeof item === 'object') {
          const fieldValue = item[filterCriteria.field];
          if (filterCriteria.operator === 'equals') {
            return fieldValue === filterCriteria.value;
          } else if (filterCriteria.operator === 'contains') {
            return String(fieldValue).includes(String(filterCriteria.value));
          } else if (filterCriteria.operator === 'greaterThan') {
            return Number(fieldValue) > Number(filterCriteria.value);
          } else if (filterCriteria.operator === 'lessThan') {
            return Number(fieldValue) < Number(filterCriteria.value);
          }
        }
        return false;
      }
      return true;
    });
  }
  return data;
}

export function filterData2(data, filterCriteria) {
  if (Array.isArray(data)) {
    return data.filter(item => {
      if (filterCriteria.field && filterCriteria.value) {
        if (item && typeof item === 'object') {
          const fieldValue = item[filterCriteria.field];
          if (filterCriteria.operator === 'equals') {
            return fieldValue === filterCriteria.value;
          } else if (filterCriteria.operator === 'contains') {
            return String(fieldValue).includes(String(filterCriteria.value));
          } else if (filterCriteria.operator === 'greaterThan') {
            return Number(fieldValue) > Number(filterCriteria.value);
          } else if (filterCriteria.operator === 'lessThan') {
            return Number(fieldValue) < Number(filterCriteria.value);
          }
        }
        return false;
      }
      return true;
    });
  }
  return data;
}

