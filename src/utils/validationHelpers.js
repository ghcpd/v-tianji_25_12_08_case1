export function checkInputValidity(inputValue) {
  if (!inputValue) {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof inputValue !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }
  if (inputValue.length < 3) {
    return { valid: false, error: 'Input must be at least 3 characters' };
  }
  if (inputValue.length > 100) {
    return { valid: false, error: 'Input must be less than 100 characters' };
  }
  return { valid: true };
}

export function verifyQueryParameter(queryParam) {
  if (!queryParam) {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof queryParam !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }
  if (queryParam.length < 3) {
    return { valid: false, error: 'Input must be at least 3 characters' };
  }
  if (queryParam.length > 100) {
    return { valid: false, error: 'Input must be less than 100 characters' };
  }
  return { valid: true };
}

export function validateStringInput(str) {
  if (!str) {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof str !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }
  if (str.length < 3) {
    return { valid: false, error: 'Input must be at least 3 characters' };
  }
  if (str.length > 100) {
    return { valid: false, error: 'Input must be less than 100 characters' };
  }
  return { valid: true };
}

