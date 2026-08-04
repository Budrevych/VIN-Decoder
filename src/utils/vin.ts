/**
 * Normalizes VIN input by trimming whitespace and converting to uppercase.
 */
export const normalizeVin = (vin: string): string => {
  return vin.trim().toUpperCase();
};

/**
 * Validates VIN input according to specification requirements:
 * - Non-empty
 * - Max 17 characters (allows 1-17 characters)
 * - Forbidden letters: I, O, Q
 * - Alphanumeric characters only (Latin letters and numbers)
 *
 * Returns error string or null if valid.
 */
export const validateVin = (vinInput: string): string | null => {
  const vin = normalizeVin(vinInput);

  if (!vin) {
    return 'Please enter a VIN code (field cannot be empty)';
  }

  if (vin.length > 17) {
    return `VIN contains ${vin.length} characters. Maximum allowed is 17 characters`;
  }

  if (/[IOQ]/.test(vin)) {
    return 'VIN contains forbidden letters (I, O, or Q are not allowed in VINs)';
  }

  if (!/^[A-Z0-9]+$/.test(vin)) {
    return 'VIN can only contain English letters and digits';
  }

  return null;
};
