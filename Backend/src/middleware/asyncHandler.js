/**
 * Async handler to wrap controller functions and forward uncaught errors to error middleware
 * @param {Function} fn - Async express route handler function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

