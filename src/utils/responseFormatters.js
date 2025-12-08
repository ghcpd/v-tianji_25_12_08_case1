export function createFormattedResponse(response) {
  if (response.success) {
    if (response.data) {
      if (Array.isArray(response.data)) {
        return {
          formatted: true,
          type: 'array',
          count: response.data.length,
          items: response.data.map(item => {
            if (item && typeof item === 'object') {
              return {
                id: item.id || item._id || Math.random().toString(36).substr(2, 9),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || new Date().toISOString()
              };
            }
            return {
              id: Math.random().toString(36).substr(2, 9),
              content: String(item),
              timestamp: new Date().toISOString()
            };
          })
        };
      } else if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: {
            id: response.data.id || response.data._id || Math.random().toString(36).substr(2, 9),
            content: response.data.content || response.data.text || response.data.name || JSON.stringify(response.data),
            timestamp: response.data.timestamp || response.data.createdAt || new Date().toISOString()
          }
        };
      } else {
        return {
          formatted: true,
          type: 'primitive',
          data: {
            id: Math.random().toString(36).substr(2, 9),
            content: String(response.data),
            timestamp: new Date().toISOString()
          }
        };
      }
    } else {
      return {
        formatted: true,
        type: 'empty',
        data: {
          id: Math.random().toString(36).substr(2, 9),
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
        id: Math.random().toString(36).substr(2, 9),
        content: response.error || 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

export function buildResponseObject(response) {
  if (response.success) {
    if (response.data) {
      if (Array.isArray(response.data)) {
        return {
          formatted: true,
          type: 'array',
          count: response.data.length,
          items: response.data.map(item => {
            if (item && typeof item === 'object') {
              return {
                id: item.id || item._id || Math.random().toString(36).substr(2, 9),
                content: item.content || item.text || item.name || JSON.stringify(item),
                timestamp: item.timestamp || item.createdAt || new Date().toISOString()
              };
            }
            return {
              id: Math.random().toString(36).substr(2, 9),
              content: String(item),
              timestamp: new Date().toISOString()
            };
          })
        };
      } else if (typeof response.data === 'object') {
        return {
          formatted: true,
          type: 'object',
          data: {
            id: response.data.id || response.data._id || Math.random().toString(36).substr(2, 9),
            content: response.data.content || response.data.text || response.data.name || JSON.stringify(response.data),
            timestamp: response.data.timestamp || response.data.createdAt || new Date().toISOString()
          }
        };
      } else {
        return {
          formatted: true,
          type: 'primitive',
          data: {
            id: Math.random().toString(36).substr(2, 9),
            content: String(response.data),
            timestamp: new Date().toISOString()
          }
        };
      }
    } else {
      return {
        formatted: true,
        type: 'empty',
        data: {
          id: Math.random().toString(36).substr(2, 9),
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
        id: Math.random().toString(36).substr(2, 9),
        content: response.error || 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

