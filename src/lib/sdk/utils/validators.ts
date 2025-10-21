interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEvent(eventName: string): ValidationResult {
  if (!eventName || typeof eventName !== 'string') {
    return { valid: false, error: 'Event name must be a non-empty string' };
  }
  if (!/^[a-z][a-z0-9_]*$/.test(eventName)) {
    return { valid: false, error: 'Event name must be snake_case and start with a letter' };
  }
  if (eventName.length > 100) {
    return { valid: false, error: 'Event name must be 100 characters or less' };
  }
  return { valid: true };
}

export function validateProperties(properties: any): ValidationResult {
  if (typeof properties !== 'object' || properties === null || Array.isArray(properties)) {
    return { valid: false, error: 'Properties must be an object' };
  }
  for (const [key, value] of Object.entries(properties)) {
    if (!/^[a-z][a-z0-9_]*$/.test(key)) {
      return { valid: false, error: `Property key "${key}" must be snake_case` };
    }
    const valueType = typeof value;
    if (!['string', 'number', 'boolean', 'undefined'].includes(valueType) && value !== null) {
      if (!Array.isArray(value)) {
        return { valid: false, error: `Property "${key}" must be a primitive value or array` };
      }
    }
  }
  return { valid: true };
}