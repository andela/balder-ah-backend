import models from '../db/models';

const { User } = models;

/**
 * @description class representing Email Verification
 *
 * @class EmailVerifier
 */
class EmailVerifier {
  /**
   * @description - This method is responsible for verifying an email
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof EmailVerifier
   */
  static async emailVerifier(request, response) {
    const { email, emailToken } = request.query;
    try {
      const foundUser = await User.find({
        where: { email }
      });
      if (foundUser) {
        const { isVerified } = foundUser;
        if (isVerified) {
          return response.status(204).json({
            message: 'Email already verified'
          });
        }
        const tokenFound = await User.find({
          where: { emailtoken: emailToken }
        });
        if (tokenFound) {
          await User.update({ isVerified: true }, { where: { email } });
          return response.status(201).json({
            status: 'Success',
            message: `Your email: ${foundUser.email} has been verified`
          });
        }
        return response.status(404).json({
          status: 'Fail',
          message: 'Token not found'
        });
      }
      return response.status(404).json({
        status: 'Fail',
        message: 'User not found'
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        message: 'Something went wrong',
        error: error.messaage
      });
    }
  }
}

const { emailVerifier } = EmailVerifier;

export default { emailVerifier };

