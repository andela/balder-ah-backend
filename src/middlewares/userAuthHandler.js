/**
 * @description class representing user authentication fields validations
 *
 * @class userAuthHandler
 */
class userAuthHandler {
  /**
   * @description - This method is responsible for checking password field if undefined
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkUndefinedPass(request, response, next) {
    const { password } = request.body;
    const errors = [];
    if (password === undefined) {
      const error = {
        message: 'please add a password field'
      };
      errors.push(error);
      return response.status(400).json({
        errors: { body: errors.map(err => err.message) }
      });
    }
    request.body.password = password.trim();
    next();
  }
}

const { checkUndefinedPass } = userAuthHandler;
export default checkUndefinedPass;
