/**
 * Sanitizes an incoming string by stripping HTML tags, trimming whitespace,
 * and enforcing maximum length limits to prevent payload inflation.
 */
export function sanitizeString(val: any, maxLength = 5000): string {
  if (val === null || val === undefined) return '';
  let str = typeof val === 'string' ? val : String(val);
  
  // Strip HTML tags to prevent XSS/injection
  str = str.replace(/<[^>]*>/g, '');
  
  // Remove dangerous control characters (like null byte)
  str = str.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Truncate to maximum allowed length
  if (str.length > maxLength) {
    str = str.substring(0, maxLength);
  }
  
  return str.trim();
}

/**
 * Validates the structure of the incoming CanvasData payload.
 * Returns true if valid, false if malformed.
 */
export function validateCanvasData(data: any): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  // Ensure title is a valid string if provided
  if ('title' in data && typeof data.title !== 'string') {
    return false;
  }

  // Ensure swot is a valid nested object if provided
  if ('swot' in data) {
    const swot = data.swot;
    if (swot && (typeof swot !== 'object' || Array.isArray(swot))) {
      return false;
    }
  }

  return true;
}
