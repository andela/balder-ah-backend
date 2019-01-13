import crypto from 'crypto';
import { compareSync } from 'bcrypt';
import models from '../db/models';
import emailSender from '../helpers/emailSender';
import { generateToken } from '../middlewares/authentication';
import errorResponse from '../helpers';

const { User } = models;
/**
 * @description class representing User Authentication
 *
 * @class UserController
 */
class UserController {
  /**
   * @description - This method is responsible for creating new users
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserController
   */
  static async registerUser(request, response) {
    const { username, email, password } = request.body;
    try {
      const userInfo = await User.create({
        username,
        email,
        password
      });
      const { id, role } = userInfo;
      const payload = { id, username: userInfo.username, role };
      try {
        if (userInfo) {
          const generatedEmailToken = crypto.randomBytes(16).toString('hex');
          const verifier = await User.update({
            emailtoken: generatedEmailToken
          }, { where: { email } });
          if (verifier) {
            emailSender(userInfo.email, generatedEmailToken);
          }
        }
        const time = {};
        time.expiresIn = '24h';
        const token = generateToken(payload, time);
        response.status(201).json({
          message: 'Signed up successfully',
          token
        });
      } catch (error) {
        response
          .status(500)
          .send(
            errorResponse([
              'Account created successfully but encountered an error while generating token for user'
            ])
          );
      }
    } catch ({ errors: validationErrors }) {
      response.status(400).send(errorResponse([...validationErrors.map(error => error.message)]));
    }
  }

  /**
   * @description - This method is responsible for logging in users
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserController
   */
  static async loginUser(request, response) {
    const { email, password, rememberMe } = request.body;
    try {
      const foundUser = await User.findOne({
        where: { email }
      });
      if (!foundUser) {
        return response.status(404).json({
          status: 'Fail',
          message: 'Incorrect login credentials'
        });
      }
      const checkPassword = compareSync(password, foundUser.password);

      if (!checkPassword) {
        return response.status(401).json({
          status: 'Fail',
          message: 'Incorrect login credentials'
        });
      }
      const { id, username, role } = foundUser;
      const payload = { id, username, role };
      const time = {};
      if (!rememberMe) {
        time.expiresIn = '24h';
      } else {
        time.expiresIn = '240h';
      }
      try {
        const token = generateToken(payload, time);
        response.status(200).json({
          message: `Welcome back ${foundUser.username}`,
          token
        });
      } catch (error) {
        response.status(500).send(errorResponse(['Failed to generate token for user']));
      }
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }

  /**
   * @description - This method is responsible for assigning roles to users
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserController
   */
  static async assignRole(request, response) {
    try {
      const { email, role } = request.body;
      if (role !== 'admin' && role !== 'user') {
        return response.status(400).json({
          status: 'Fail',
          message: `Status can only be ${"'admin'"} or ${"'user'"}`
        });
      }
      const fieldToUpdate = {
        role
      };
      const updatedUser = await User.update(fieldToUpdate, {
        where: {
          email
        },
        returning: true
      });
      return response.status(200).json({
        status: 'Success',
        message: 'User role updated successfully',
        updatedUser
      });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        message: errorResponse(['internal server error, please try again later']),
      });
    }
  }

  /**
   * @description - This method is responsible for deleting users
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserController
   */
  static async deleteUser(request, response) {
    const { email } = request.body;
    try {
      await User.destroy({ where: { email } });
      return response.status(200).json({
        status: 'Success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        message: errorResponse(['internal server error, please try again later'])
      });
    }
  }
}

const {
  registerUser,
  loginUser,
  assignRole,
  deleteUser
} = UserController;

export {
  registerUser,
  loginUser,
  assignRole,
  deleteUser
};
