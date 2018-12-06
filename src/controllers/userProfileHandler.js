import user from '../db/models';

const { User } = user;

/**
 * @description class representing user profiles
 *
 * @class UserProfileHandler
 */
class UserProfileHandler {
  /**
   * @description - This method is responsible for retrieving a currently logged in user
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserProfileHandler
   */
  static async getCurrentUser(request, response) {
    const { payload } = request.userData;
    const userId = payload.id;
    try {
      const foundUser = await User.findOne({
        where: { id: userId }
      });

      const currentUser = {
        username: foundUser.username,
        email: foundUser.email,
        bio: foundUser.bio,
        image: foundUser.image
      };
      if (foundUser) {
        return response.status(200).json({
          status: 'Success',
          message: 'Retrieved user successfully',
          currentUser
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }

  /**
   * @description - This method is responsible for updating a user's profile
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserProfileHandler
   */
  static async updateProfile(request, response) {
    const { payload } = request.userData;
    const userId = payload.id;
    try {
      const foundUser = await User.findOne({
        where: { id: userId }
      });
      const updatedUser = await User.update(
        {
          username: request.body.username || foundUser.username,
          email: request.body.email || foundUser.email,
          bio: request.body.bio || foundUser.bio,
          image: request.body.image || foundUser.image
        },
        {
          where: { id: foundUser.id }
        }
      );
      if (updatedUser) {
        return response.status(200).json({
          status: 'Success',
          message: 'Updated profile successfully'
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }

  /**
   * @description - This method is responsible for retrieving a user's profile
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message and user object
   *
   * @memberof UserProfileHandler
   */
  static async getUserProfile(request, response) {
    const { username } = request.params;
    try {
      const userProfileFound = await User.findOne({
        where: { username }
      });
      if (userProfileFound) {
        const userProfile = {
          username: userProfileFound.username,
          bio: userProfileFound.bio,
          image: userProfileFound.image
        };
        return response.status(200).json({
          status: 'Success',
          message: 'Profile retrieved successfully',
          userProfile
        });
      }
      return response.status(404).json({
        message: 'user not found'
      });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }
}

const { getCurrentUser, updateProfile, getUserProfile } = UserProfileHandler;

export { getCurrentUser, updateProfile, getUserProfile };
