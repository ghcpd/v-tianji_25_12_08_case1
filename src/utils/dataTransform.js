export function convertToUppercase(input) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  } else if (Array.isArray(input)) {
    return input.map(elem => {
      if (typeof elem === 'string') {
        return elem.toUpperCase();
      } else if (elem && typeof elem === 'object' && elem.value) {
        return { ...elem, value: String(elem.value).toUpperCase() };
      }
      return elem;
    });
  } else if (input && typeof input === 'object' && input.value) {
    return { ...input, value: String(input.value).toUpperCase() };
  }
  return input;
}

export function convertToLowercase(input) {
  if (typeof input === 'string') {
    return input.toLowerCase();
  } else if (Array.isArray(input)) {
    return input.map(elem => {
      if (typeof elem === 'string') {
        return elem.toLowerCase();
      } else if (elem && typeof elem === 'object' && elem.value) {
        return { ...elem, value: String(elem.value).toLowerCase() };
      }
      return elem;
    });
  } else if (input && typeof input === 'object' && input.value) {
    return { ...input, value: String(input.value).toLowerCase() };
  }
  return input;
}

export function reverseData(input) {
  if (typeof input === 'string') {
    return input.split('').reverse().join('');
  } else if (Array.isArray(input)) {
    return input.slice().reverse();
  }
  return input;
}

export function applyDataTransformation(inputData, transformation) {
  if (transformation === 'uppercase') {
    return convertToUppercase(inputData);
  } else if (transformation === 'lowercase') {
    return convertToLowercase(inputData);
  } else if (transformation === 'reverse') {
    return reverseData(inputData);
  }
  return inputData;
}

export function handleArrayProcessing(inputArray) {
  if (!Array.isArray(inputArray)) {
    return { error: 'Input must be an array' };
  }
  
  const processedItems = [];
  for (let index = 0; index < inputArray.length; index++) {
    const currentItem = inputArray[index];
    if (currentItem && typeof currentItem === 'object') {
      const transformedItem = {
        id: currentItem.id || currentItem._id || `item-${index}`,
        value: currentItem.value || currentItem.data || currentItem.content || 0,
        timestamp: currentItem.timestamp || currentItem.createdAt || new Date().toISOString(),
        processed: true
      };
      processedItems.push(transformedItem);
    } else {
      processedItems.push({
        id: `item-${index}`,
        value: currentItem || 0,
        timestamp: new Date().toISOString(),
        processed: true
      });
    }
  }
  return { success: true, data: processedItems };
}

export function handleObjectProcessing(inputObject) {
  if (!inputObject || typeof inputObject !== 'object') {
    return { error: 'Input must be an object' };
  }
  
  const transformedObject = {
    id: inputObject.id || inputObject._id || Math.random().toString(36).substr(2, 9),
    value: inputObject.value || inputObject.data || inputObject.content || '',
    timestamp: inputObject.timestamp || inputObject.createdAt || new Date().toISOString(),
    processed: true
  };
  
  return { success: true, data: transformedObject };
}

export function applyFiltering(dataArray, criteria) {
  if (Array.isArray(dataArray)) {
    return dataArray.filter(element => {
      if (criteria.field && criteria.value) {
        if (element && typeof element === 'object') {
          const fieldData = element[criteria.field];
          if (criteria.operator === 'equals') {
            return fieldData === criteria.value;
          } else if (criteria.operator === 'contains') {
            return String(fieldData).includes(String(criteria.value));
          } else if (criteria.operator === 'greaterThan') {
            return Number(fieldData) > Number(criteria.value);
          } else if (criteria.operator === 'lessThan') {
            return Number(fieldData) < Number(criteria.value);
          }
        }
        return false;
      }
      return true;
    });
  }
  return dataArray;
}

