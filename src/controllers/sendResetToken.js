import models from '../db/models';
import { sendgrid } from '../middlewares/helper';
import { generateToken } from '../middlewares/authentication';

const { User } = models;

/**
  * @description class representing reset user password
  *
  * @class SendResettoken
  */
class SendResetToken {
  /**
    * @description - This method is responsible for creating password reset token
    *
    * @static
    * @param {object} request - Request sent to the router
    * @param {object} response - Response sent from the controller
    *
    * @returns {object} - object representing response message
    *
    */
  static async resetToken(request, response) {
    const { HOST_URL, NO_REPLY_MAIL } = process.env;
    try {
      const { email } = request.body;
      if (email.trim().length < 1) {
        return response.status(400).json({
          status: 'Fail',
          message: 'The email field cannot be empty'
        });
      }
      const userData = await User.findOne({
        where: { email }
      });

      if (!userData) {
        return response.status(400).json({
          status: 'Fail',
          message: 'The email does not exist, please sign up.',
        });
      }

      const { id, username } = userData.dataValues;
      const payload = { id, email, username };
      const time = { expiresIn: '24hr' };
      const userToken = generateToken({ payload }, time);
      await sendgrid(userData.email, NO_REPLY_MAIL, HOST_URL, userToken);
      response.status(200).json({
        status: 'Success',
        message: 'Password reset link has been sent to your mail',
        userToken
      });
    } catch (error) {
      response.status(500).json({
        status: 'Error',
        error: error.message
      });
    }
  }

  /**
    * @description - This method is responsible for updating user password
    *
    * @static
    * @param {object} request - Request sent to the router
    * @param {object} response - Response sent from the controller
    *
    * @returns {object} - object representing response message
    *
    */
  static async updateUserPassword(request, response) {
    const { password, confirmNewPassword } = request.body;
    try {
      const { email } = request.decoded;
      if (password !== confirmNewPassword) {
        return response.status(400).json({
          status: 'Fail',
          message: 'The passwords do not match, confirm and type again.'
        });
      }
      const userToUpdate = await User.findOne({
        where: { email }
      });
      await userToUpdate.update({
        password,
      });
      response.status(200).json({
        status: 'Success',
        message: 'Password updated successfully',
      });
    } catch (error) {
      response.status(500).json({
        status: 'Error',
        error: error.message,
      });
    }
  }
}
const { resetToken, updateUserPassword } = SendResetToken;
export { resetToken, updateUserPassword };
