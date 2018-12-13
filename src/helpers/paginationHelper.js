import errorResponse from './index';

/**
 * @description class representing pagination helper functions
 * @class paginationHelper
 */
class paginationHelper {
  /**
   ** @description - This method is responsible for verifying if a query parameter is negative
   * @param {*} request
   * @param {*} response
   * @param {*} next
   * @returns {object} - object representing response message
   */
  static checkQueryparameter(request, response, next) {
    const { page = 1 } = request.query;
    if (page < 1) {
      return response.status(400).json(errorResponse(['Page number must be 1 or greater than 1']));
    }
    if (Number.isNaN(Number(page))) {
      return response.status(400).json(errorResponse(['Page can only be numbers']));
    }
    return next();
  }
}
export default paginationHelper;
