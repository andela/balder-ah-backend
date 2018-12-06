/**
 * @description class representing parameter validations
 *
 * @class ParamsHandler
 */
class ParamsHandler {
  /**
   * @description - This method is responsible for checking username parameters
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof ParamsHandler
   */
  static async checkUsernameParam(request, response, next) {
    let { username } = request.params;
    username = username.trim();
    const errors = [];
    if (username === undefined || username === '') {
      const error = {
        message: 'please add a username parameter'
      };
      errors.push(error);
    }
    if (username.length > 100) {
      const error = {
        message: 'please username should be less than 100 characters'
      };
      errors.push(error);
    }
    if (errors.length > 0) {
      return response.status(400).json({
        errors: { body: errors.map(error => error.message) }
      });
    }
    request.body.username = username;
    next();
  }
}

const { checkUsernameParam } = ParamsHandler;

export default checkUsernameParam;
