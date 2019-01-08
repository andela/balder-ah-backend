/**
 * @description class responsible for rating articles
 *
 * @class ValidateRating
 */
class ValidateRating {
  /**
   * @description - This method is responsible for validating rating input from users
   * @static
   * @param {object} request - Request sent to the middleware
   * @param {object} response - Response sent from the middleware
   * @param {object} next - callback function that transfers to the next method
   * @returns {object} - object representing response message
   * @memberof ValidateRating
   */
  static async articleRatingValidator(request, response, next) {
    let { rating } = request.body;
    const errors = [];
    if (rating === undefined || rating === '') {
      const error = {
        message: 'please add a rating parameter'
      };
      errors.push(error);
    }
    if (!/^[1-5]$/.test(rating)) {
      const error = {
        message: 'rating should be a positive integer between 1 to 5'
      };
      errors.push(error);
    }
    if (errors.length > 0) {
      return response.status(400).json({
        errors: { body: errors.map(error => error.message) }
      });
    }
    rating = rating.trim();
    request.body.rating = rating;
    next();
  }
}

const { articleRatingValidator } = ValidateRating;

export default articleRatingValidator;
