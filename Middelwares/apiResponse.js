/**
 * @desc Send any success response
 * @param {string} message
 * @param {object | array} results
 * @param {number} statusCode
 */
exports.success = (message, results, statusCode) => {
  return {
    message,
    error: false,
    code: statusCode,
    results
  };
};

/**
 * @desc Send any error response
 * @param {string} message
 * @param {number} statusCode
 */
exports.error = (message, statusCode) => {
  const validCodes = [200, 201, 400, 401, 404, 403, 422, 500];
  const finalCode = validCodes.includes(statusCode) ? statusCode : 500;

  return {
    message,
    code: finalCode,
    error: true
  };
};

/**
 * @desc Send validation error response
 * @param {object | array} errors
 */
exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors
  };
};
