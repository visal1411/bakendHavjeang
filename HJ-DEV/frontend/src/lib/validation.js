/**
 * Input Validation Utilities
 *
 * Reusable validation functions for form inputs
 */

/**
 * Prevent negative number input in number fields
 * Use in onKeyDown event handler
 *
 * @param {KeyboardEvent} e - Keyboard event
 * @example
 * <Input type="number" onKeyDown={preventNegativeInput} />
 */
export const preventNegativeInput = (e) => {
  if (e.key === "-" || e.key === "e" || e.key === "E") {
    e.preventDefault();
  }
};

/**
 * Validate and sanitize numeric input
 * Ensures value is non-negative
 *
 * @param {string|number} value - Input value
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (optional)
 * @returns {number|null} - Sanitized number or null if invalid
 *
 * @example
 * const price = validateNumericInput(e.target.value, 0, 1000);
 * if (price !== null) {
 *   setPrice(price);
 * }
 */
export const validateNumericInput = (value, min = 0, max = Infinity) => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) return null;
  if (numValue < min) return null;
  if (numValue > max) return null;

  return numValue;
};

/**
 * Handle numeric input change with validation
 * Prevents negative values and invalid numbers
 *
 * @param {Event} e - Change event
 * @param {Function} setter - State setter function
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (optional)
 *
 * @example
 * <Input
 *   type="number"
 *   onChange={(e) => handleNumericChange(e, setPrice, 0, 1000)}
 * />
 */
export const handleNumericChange = (e, setter, min = 0, max = Infinity) => {
  const value = e.target.value;

  // Allow empty string for user to clear input
  if (value === "") {
    setter("");
    return;
  }

  const numValue = validateNumericInput(value, min, max);
  if (numValue !== null) {
    setter(value);
  }
};

/**
 * Validate price input
 * Ensures price is positive and has max 2 decimal places
 *
 * @param {number} price - Price value
 * @param {number} min - Minimum price (default: 0)
 * @param {number} max - Maximum price (default: 10000)
 * @returns {boolean} - True if valid
 */
export const validatePrice = (price, min = 0, max = 10000) => {
  const numPrice = parseFloat(price);

  if (isNaN(numPrice)) return false;
  if (numPrice < min) return false;
  if (numPrice > max) return false;

  // Check for max 2 decimal places
  const decimals = (numPrice.toString().split(".")[1] || "").length;
  if (decimals > 2) return false;

  return true;
};

/**
 * Format price for display
 *
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price
 *
 * @example
 * formatPrice(25.5) // "$25.50"
 */
export const formatPrice = (price, currency = "$") => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return `${currency}0.00`;
  return `${currency}${numPrice.toFixed(2)}`;
};

/**
 * Props for numeric input with validation
 * Returns object with all necessary props
 *
 * @param {string|number} value - Current value
 * @param {Function} onChange - Change handler
 * @param {Object} options - Configuration
 * @returns {Object} - Props object
 *
 * @example
 * <Input {...getNumericInputProps(price, setPrice, { min: 0, step: 0.5 })} />
 */
export const getNumericInputProps = (value, onChange, options = {}) => {
  const {
    min = 0,
    max = Infinity,
    step = "0.01",
    placeholder = "0.00",
  } = options;

  return {
    type: "number",
    min,
    max: max === Infinity ? undefined : max,
    step,
    placeholder,
    value,
    onChange: (e) => handleNumericChange(e, onChange, min, max),
    onKeyDown: preventNegativeInput,
  };
};

/**
 * Validate phone number (Cambodia format)
 *
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
  // Cambodia: +855 XX XXX XXX or +855 XX XXX XXXX
  const phoneRegex = /^\+855[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate distance (in kilometers)
 *
 * @param {number} distance - Distance value
 * @returns {boolean} - True if valid (0-1000 km)
 */
export const validateDistance = (distance) => {
  const numDistance = parseFloat(distance);
  return !isNaN(numDistance) && numDistance >= 0 && numDistance <= 1000;
};

/**
 * Validate rating (1-5 stars)
 *
 * @param {number} rating - Rating value
 * @returns {boolean} - True if valid
 */
export const validateRating = (rating) => {
  const numRating = parseInt(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};
