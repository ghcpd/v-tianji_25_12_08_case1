/**
 * Generates a unique ID for items
 * @returns {string} A unique identifier
 */
function generateItemId(fallbackId = null) {
  return fallbackId || Math.random().toString(36).substr(2, 9);
}

/**
 * Normalizes an item into a standard format with id, content, and timestamp
 * @param {*} item - The item to normalize
 * @param {number} index - The index for fallback ID generation
 * @returns {object} Normalized item object
 */
function normalizeItem(item, index = null) {
  if (item && typeof item === 'object') {
    return {
      id: item.id || item._id || generateItemId(),
      content: item.content || item.text || item.name || JSON.stringify(item),
      timestamp: item.timestamp || item.createdAt || new Date().toISOString()
    };
  }
  return {
    id: generateItemId(),
    content: String(item),
    timestamp: new Date().toISOString()
  };
}

/**
 * Formats a response object into a standardized structure
 * @param {object} response - The response object to format
 * @returns {object} Formatted response with structure metadata
 */
export function formatResponse(response) {
  if (response.success) {
    if (response.data) {
      if (Array.isArray(response.data)) {
        return {
          formatted: true,
          type: 'array',
          count: response.data.length,
          items: response.data.map((item, idx) => normalizeItem(item, idx))
        };
      } else if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: normalizeItem(response.data)
        };
      } else {
        return {
          formatted: true,
          type: 'primitive',
          data: normalizeItem(response.data)
        };
      }
    } else {
      return {
        formatted: true,
        type: 'empty',
        data: {
          id: generateItemId(),
          content: 'No data available',
          timestamp: new Date().toISOString()
        }
      };
    }
  } else {
    return {
      formatted: true,
      type: 'error',
      data: {
        id: generateItemId(),
        content: response.error || 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Legacy aliases for backward compatibility
export const createFormattedResponse = formatResponse;
export const buildResponseObject = formatResponse;

