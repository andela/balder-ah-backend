/**
 * @description class representing user update fields validations
 *
 * @class UpdateHandler
 */
class UpdateHandler {
  /**
   * @description - This method is responsible for checking image format
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkImageUrl(request, response, next) {
    let { image } = request.body;
    image = image.trim();
    const errors = [];
    const myRegex = /(https?:\/\/.*\.(?:png|jpg|JPEG|JPG|GIF))/i;
    if (!myRegex.test(image)) {
      const error = {
        message: 'please enter a valid image URL'
      };
      errors.push(error);
      return response.status(400).json({
        errors: { body: errors.map(err => err.message) }
      });
    }
    next();
  }

  /**
   * @description - This method is responsible for checking if the request fields are undefined
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkUndefined(request, response, next) {
    const {
      bio, image, email, username
    } = request.body;
    const errors = [];
    if (bio === undefined) {
      const error = {
        message: 'please add a bio field'
      };
      errors.push(error);
    }
    if (image === undefined) {
      const error = {
        message: 'please add an image field'
      };
      errors.push(error);
    }
    if (username === undefined) {
      const error = {
        message: 'please add a username field'
      };
      errors.push(error);
    }
    if (email === undefined) {
      const error = {
        message: 'please add an email field'
      };
      errors.push(error);
    }
    if (errors.length > 0) {
      return response.status(400).json({
        errors: { body: errors.map(error => error.message) }
      });
    }
    next();
  }

  /**
   * @description - This method is responsible for checking if the request fields are empty
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkEmpty(request, response, next) {
    let {
      bio, image, email, username
    } = request.body;
    const bioTrim = bio.trim();
    const imageTrim = image.trim();
    const emailTrim = email.trim();
    const usernameTrim = username.trim();
    const errors = [];
    if (bioTrim === '') {
      const error = {
        message: 'please enter a bio'
      };
      errors.push(error);
    }
    if (imageTrim === '') {
      const error = {
        message: 'please enter an image url'
      };
      errors.push(error);
    }
    if (usernameTrim === '') {
      const error = {
        message: 'please enter a username'
      };
      errors.push(error);
    }
    if (emailTrim === '') {
      const error = {
        message: 'please enter an email'
      };
      errors.push(error);
    }
    if (errors.length > 0) {
      return response.status(400).json({
        errors: { body: errors.map(error => error.message) }
      });
    }
    bio = bioTrim;
    image = imageTrim;
    email = emailTrim;
    username = usernameTrim;
    request.body = {
      bio,
      image,
      email,
      username
    };
    next();
  }

  /**
   * @description - This method is responsible for checking the length of the inputs
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkLength(request, response, next) {
    const { bio, username } = request.body;
    const errors = [];
    if (bio.length > 240) {
      const error = {
        message: 'please bio should not be more than 240 characters'
      };
      errors.push(error);
    }
    if (username.length > 100) {
      const error = {
        message: 'please username should not be more than 100 characters'
      };
      errors.push(error);
    }
    if (errors.length > 0) {
      return response.status(400).json({
        errors: { body: errors.map(error => error.message) }
      });
    }
    next();
  }
}

const {
  checkUndefined,
  checkEmpty,
  checkImageUrl,
  checkLength
} = UpdateHandler;

export {
  checkUndefined,
  checkEmpty,
  checkImageUrl,
  checkLength
};
