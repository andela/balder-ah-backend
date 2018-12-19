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
    if (image && !myRegex.test(image)) {
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
      bio, image, email, username, phoneNo
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
    if (phoneNo === undefined) {
      const error = {
        message: 'please add a phone number(phoneNo) field'
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
      bio, image, email, username, phoneNo
    } = request.body;
    const errors = [];
    if (bio) {
      bio = bio.trim();
    }
    if (image) {
      image = image.trim();
    }
    if (phoneNo) {
      phoneNo = phoneNo.trim();
    }
    username = username.trim();
    if (username === '') {
      const error = {
        message: 'please enter a username'
      };
      errors.push(error);
    }
    email = email.trim();
    if (email === '') {
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
    request.body = {
      bio,
      image,
      email,
      username,
      phoneNo
    };
    next();
  }

  /**
   * @description - This method is responsible for checking the type of the update fields
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - callback function to transfer to the next method
   * @returns {object} - object representing response message
   * @memberof UpdateHandler
   */
  static async checkType(request, response, next) {
    const {
      phoneNo
    } = request.body;
    const errors = [];
    if (phoneNo && !(/^[0-9]+$/.test(phoneNo))) {
      const error = {
        message: 'please enter a valid phone number'
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
    if (bio && bio.length > 240) {
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
  checkLength,
  checkType
} = UpdateHandler;

export {
  checkUndefined,
  checkEmpty,
  checkImageUrl,
  checkLength,
  checkType
};
