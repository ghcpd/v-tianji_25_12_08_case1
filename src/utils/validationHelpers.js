/**
 * Validates string input with configurable length constraints
 * @param {string} input - The input to validate
 * @param {number} minLength - Minimum allowed length (default: 3)
 * @param {number} maxLength - Maximum allowed length (default: 100)
 * @returns {object} Validation result with valid flag and optional error message
 */
export function validateStringInput(input, minLength = 3, maxLength = 100) {
  if (!input) {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof input !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }
  if (input.length < minLength) {
    return { valid: false, error: `Input must be at least ${minLength} characters` };
  }
  if (input.length > maxLength) {
    return { valid: false, error: `Input must be less than ${maxLength + 1} characters` };
  }
  return { valid: true };
}

// Legacy aliases for backward compatibility
export const checkInputValidity = validateStringInput;
export const verifyQueryParameter = validateStringInput;

