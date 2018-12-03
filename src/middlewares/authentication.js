import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
  * @description class representing User Authentication with JWT
  *
  * @class VerifyUser
  */
class VerifyUser {
  /**
    * @description - This method is responsible for generating user token
    *
    * @static
    * @param {object} payload - Object representing encoded data that makes up the token
    * @param {object} time - Object represnting time taken for the token to expire
    *
    * @returns {object} - object representing response message
    *
    * @memberof VerifyUser
    */
  static generateToken(payload, time) {
    const token = jwt.sign({ payload }, process.env.TOKEN_SECRET_KEY, time);
    return token;
  }

  /**
    * @description - This method is responsible for creating new users
    *
    * @static
    * @param {object} request - Request sent to the router
    * @param {object} response - Response sent from the controller
    * @param {object} next - callback function to transfer to the next method
    * @param {object} userData - Object representing decoded data that made up the token
    * @param {object} error - Object representing JWT error
    *
    * @returns {object} - object representing response message
    *
    * @memberof VerifyUser
    */
  static verifyToken(request, response, next) {
    const token = request.headers.authorization || request.body.token;
    if (!token) {
      return response.status(403)
        .json({
          status: 'Fail',
          message: 'No token supplied',
        });
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, userData) => {
      if (error) {
        if (error.message.includes('signature')) {
          return response.status(403)
            .json({
              status: 'Fail',
              message: 'Your input is not a JWT token',
            });
        }
        return response.status(403)
          .json({
            message: error,
          });
      }
      request.userData = userData;
      return next();
    });
  }
}

const { generateToken, verifyToken } = VerifyUser;

export {
  generateToken,
  verifyToken
};
