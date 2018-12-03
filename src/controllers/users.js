import bcrypt, { compareSync } from 'bcrypt';
import user from '../db/models';
import { generateToken } from '../middlewares/authentication';

const { User } = user;

/**
  * @description class representing User Authentication
  *
  * @class UserHandler
  */
class userHandler {
  /**
    * @description - This method is responsible for creating new users
    *
    * @static
    * @param {object} request - Request sent to the router
    * @param {object} response - Response sent from the controller
    *
    * @returns {object} - object representing response message
    *
    * @memberof UserHandler
    */
  static async registerUser(request, response) {
    const { username, email } = request.body;
    const password = bcrypt.hashSync(request.body.password, 10);
    try {
      const userInfo = await User.create({
        username,
        email,
        password
      });
      const payload = {
        id: userInfo.id,
        username: userInfo.username
      };
      const time = {};
      time.expiresIn = '24h';
      const token = generateToken(payload, time);
      response.status(201)
        .json({
          message: 'Signed up successfully',
          token
        });
    } catch (error) {
      response.status(500)
        .json({
          status: 'Fail',
          error
        });
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
  * @memberof UserHandler
  */
  static async loginUser(request, response) {
    const { email, password, rememberMe } = request.body;
    try {
      const foundUser = await User.findOne({
        where: { email }
      });
      if (!foundUser) {
        return response.status(404)
          .json({
            status: 'Fail',
            message: 'Incorrect login credentials',
          });
      }
      const checkPassword = compareSync(password, foundUser.password);
      if (!checkPassword) {
        return response.status(401)
          .json({
            status: 'Fail',
            message: 'Incorrect login credentials'
          });
      }
      const payload = {
        id: foundUser.id,
        username: foundUser.username
      };
      const time = {};
      if (!rememberMe) {
        time.expiresIn = '24h';
      } else {
        time.expiresIn = '240h';
      }
      const token = generateToken(payload, time);
      return response.status(200)
        .json({
          message: `Welcome back ${foundUser.username}`,
          token
        });
    } catch (error) {
      response.status(500)
        .json({
          status: 'Fail',
          error
        });
    }
  }
}

const { registerUser, loginUser } = userHandler;

export { registerUser, loginUser };
