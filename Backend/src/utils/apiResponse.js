import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

/**
 * Standard API Response Class
 */
export class ApiResponse {
  /**
   * @param {boolean} success - Operation success status
   * @param {string} message - Response message
   * @param {object|array|null} data - Response payload
   * @param {array} errors - Error details if any
   */
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    if (errors.length > 0) {
      this.errors = errors;
    }
  }

  /**
   * Send standard success response
   */
  static success(res, data = {}, message = RESPONSE_MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send standard error response
   */
  static error(res, message = RESPONSE_MESSAGES.SERVER_ERROR, errors = [], statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    const responsePayload = {
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
    };
    return res.status(statusCode).json(responsePayload);
  }

  /**
   * Send paginated response
   */
  static paginated(res, items = [], pagination = {}, message = RESPONSE_MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: {
        items,
        pagination: {
          total: pagination.total || items.length,
          page: pagination.page || 1,
          limit: pagination.limit || items.length,
          totalPages: pagination.totalPages || 1,
          hasNextPage: pagination.hasNextPage || false,
          hasPrevPage: pagination.hasPrevPage || false,
        },
      },
    });
  }
}

