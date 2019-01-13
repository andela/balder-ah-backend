import models from '../db/models';
import { authorRating } from './ratingController';
import logTracker from '../../logger/logTracker';

const { User, Article } = models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description class representing user profiles
 *
 * @class UserProfileController
 */
class UserProfileController {
  /**
   * @description - This method is responsible for retrieving a currently logged in user
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof UserProfileController
   */
  static async getCurrentUser(request, response) {
    const { payload } = request.userData;
    const userId = payload.id;
    try {
      const rating = await authorRating(request);
      const foundUser = await User.findOne({
        where: { id: userId },
        include: [
          {
            model: Article,
            as: 'articles',
            attributes: ['slug', 'title', 'description', 'imgUrl']
          }
        ],
      });
      if (foundUser) {
        const currentUser = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          bio: foundUser.bio,
          image: foundUser.image,
          authorRating: rating,
          articles: foundUser.articles
        };
        return response.status(200).json({
          status: 'Success',
          message: 'Retrieved user successfully',
          currentUser
        });
      }
    } catch (error) {
      logTracker(error);
      response.status(500).json({
        status: 'Fail',
        error: errorMessage
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
   * @memberof UserProfileController
   */
  static async updateProfile(request, response) {
    const { payload } = request.userData;
    const userId = payload.id;
    try {
      const foundUser = await User.findOne({
        where: { id: userId }
      });
      if (!foundUser) {
        return response.status(404).json({
          status: 'Fail',
          message: 'Please sign up'
        });
      }
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
      logTracker(error);
      response.status(500).json({
        status: 'Fail',
        message: errorMessage
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
   * @memberof UserProfileController
   */
  static async getUserProfile(request, response) {
    const { username } = request.params;
    try {
      const userProfileFound = await User.findOne({
        where: { username },
        include: [
          {
            model: Article,
            as: 'articles',
            attributes: ['slug', 'title', 'description', 'imgUrl']
          }
        ],
      });
      if (userProfileFound) {
        const userProfile = {
          username: userProfileFound.username,
          bio: userProfileFound.bio,
          image: userProfileFound.image,
          authorRating: await authorRating(request),
          articles: userProfileFound.articles,
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
      logTracker(error);
      response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }

  /**
   * @description - This method is responsible for retrieving all profiles of users on the patform
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message and user object
   *
   * @memberof UserProfileController
   */
  static async getAllProfiles(request, response) {
    const { payload } = request.userData;
    const { username } = payload;
    try {
      let allProfiles = await User.findAll({
        where: {
          username: {
            $notLike: `${username}`
          }
        },
        attributes: [
          'username', 'bio', 'image'
        ],
        include: [
          {
            association: 'articles',
          },
        ]
      });
      if (allProfiles.length < 1) {
        return response.status(404).json({
          status: 'Fail',
          message: 'No users found',
        });
      }
      allProfiles = allProfiles.map((author) => {
        author = author.toJSON();
        author.articles = author.articles.length;
        return author;
      });

      return response.status(200).json({
        status: 'Success',
        message: 'Retrieved profiles successfully',
        allProfiles,
      });
    } catch (error) {
      logTracker(error);
      response.status(500).json({
        status: 'Fail',
        error: errorMessage
      });
    }
  }
}

const {
  getCurrentUser,
  updateProfile,
  getUserProfile,
  getAllProfiles
} = UserProfileController;

export {
  getCurrentUser,
  updateProfile,
  getUserProfile,
  getAllProfiles
};
