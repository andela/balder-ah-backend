import Models from '../db/models';
import errorResponse from '../helpers/index';
import logTracker from '../../logger/logTraker';

const { User, Follow } = Models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description handles follow and unfollow
 * @class FollowController
 */
class FollowController {
  /**
   * @description Handles the follow feature
   * @param {object} request - Request object
   * @param {object} response - Response object
   * @returns {object} An object containing all the data related to the followed user
   * @memberof FollowController
   */
  static async followUser(request, response) {
    const { username } = request.params;
    const followingId = request.userData.payload.id;
    const user = await User.findOne({
      where: {
        username
      }
    });
    try {
      if (user) {
        if (followingId !== user.id) {
          Follow.findOrCreate({
            where: {
              userId: user.id,
              followerId: followingId
            }
          }).spread((check, created) => {
            if (!created) {
              return response.status(409).json(errorResponse([`You are already following ${username}`]));
            }
            return response.status(200).json({
              message: `You are now following ${username}`
            });
          });
        } else {
          return response.status(409).json(errorResponse(['You cannot follow yourself']));
        }
      } else {
        return response.status(404).json(errorResponse(['User not found']));
      }
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
   * @description Handles the unfollow feature
   * @param {object} request - Request object
   * @param {object} response - Response object
   * @returns {object} An object containing all the data related to the unfollowed user
   * @memberof FollowController
   */
  static async unfollowUser(request, response) {
    const { username } = request.params;
    const user = await User.findOne({
      where: {
        username
      }
    });
    try {
      if (user) {
        const followingId = request.userData.payload.id;
        if (followingId !== user.id) {
          const unfollow = await Follow.destroy({
            where: {
              userId: user.id,
              followerId: followingId
            }
          });
          if (unfollow) {
            return response.status(200).json({
              message: `You have Unfollowed ${username}`
            });
          }
          return response.status(400).json(errorResponse([`You were not following ${username}`]));
        }
        return response.status(409).json(errorResponse(['You cannot unfollow yourself']));
      }
      return response.status(404).json(errorResponse(['User not found']));
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
     * @description Handles getting all users a user is following
     * @param {object} request - Request object
     * @param {object} response - Response object
     * @returns {Array} An array of object containing required user data
     * @memberof FollowController
     */
  static async getAllFollowing(request, response) {
    const { username } = request.params;
    try {
      const foundUser = await User.findOne({
        where: {
          username
        },
      });
      if (foundUser) {
        const userId = request.userData.payload.id;
        const user = await Follow.findAndCountAll({
          where: {
            followerId: userId
          },
          include: [
            {
              model: User,
              as: 'following',
              attributes: ['id', 'email', 'username']
            }
          ],
          attributes: {
            exclude: [
              'id',
              'userId',
              'followerId',
              'createdAt',
              'updatedAt'
            ],
          }
        });
        if (user.rows.length === 0) {
          return response.status(200).json({
            message: 'You are not following any user'
          });
        }
        const followingList = user.rows.map(follow => follow.following);
        response.status(200).json({
          followingCount: user.count,
          following: followingList
        });
      } else {
        return response.status(404).json(errorResponse(['User not found']));
      }
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
     * @description Handles getting all users a user is following
     * @param {object} request - Request object
     * @param {object} response - Response object
     * @returns {Array} An array of object containing required user data
     * @memberof FollowController
     */
  static async getAllFollowers(request, response) {
    const { username } = request.params;
    try {
      const foundUser = await User.findOne({
        where: {
          username
        },
      });
      if (foundUser) {
        const userId = request.userData.payload.id;
        const user = await Follow.findAndCountAll({
          where: {
            userId
          },
          include: [
            {
              model: User,
              as: 'myFollowers',
              attributes: ['id', 'email', 'username']
            }
          ],
          attributes: {
            exclude: [
              'id',
              'userId',
              'followerId',
              'createdAt',
              'updatedAt'
            ],
          }
        });

        if (user.rows.length === 0) {
          return response.status(200).json({
            message: 'You have no follower'
          });
        }
        const followerList = user.rows.map(follow => follow.myFollowers);
        response.status(200).json({
          followerCount: user.count,
          follower: followerList
        });
      } else {
        return response.status(404).json(errorResponse(['User not found']));
      }
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }
}

export default FollowController;
