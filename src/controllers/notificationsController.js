import pusher from '../services/pusher';
import errorResponse from '../helpers/index';
import models from '../db/models';
import Notifier from '../helpers/notification';

const { User, Notification } = models;

/**
 * @class NotificationsController
 */
class NotificationsController {
  /**
   * @description - this method handles opting in or out of both email and in-app notifications
   * @static
   * @param {Object} request - request object
   * @param {Object} response - response object
   * @returns {Object} - success response or error message
   */
  static async optInOut(request, response) {
    const { id } = request.userData.payload;
    const validQuery = param => param === 'yes' || param === 'no';

    try {
      const user = await User.findByPk(id);
      let {
        email = user.emailNotifications ? 'yes' : 'no',
        app = user.appNotifications ? 'yes' : 'no'
      } = request.query;

      email = email.toLowerCase();
      app = app.toLowerCase();

      if (!validQuery(email) || !validQuery(app)) {
        return response
          .status(400)
          .json(errorResponse(['query params should be either yes or no']));
      }

      await User.update(
        {
          emailNotifications: email === 'yes',
          appNotifications: app === 'yes'
        },
        { where: { id } }
      );

      return response.json({
        status: 'Success',
        message: 'Notification settings updated'
      });
    } catch (error) {
      response.status(500).json(errorResponse([error.message]));
    }
  }

  /**
   * @description this method is responsible for sending notifications for a new follower
   * @static
   * @param {number} followedId - id of author who is being followed
   * @param {string} emailOfFollowed - email address of user that was followed
   * @param {number} followerId - id of author who did the following
   * @returns {void}
   */
  static async newFollower(followedId, emailOfFollowed, followerId) {
    const userId = followedId;
    const [message] = await Notifier.forNewFollower(emailOfFollowed, followerId);

    const unsubscribedUsers = await Notifier.getUnsubscribedUsers('app');
    if (!unsubscribedUsers.includes(userId)) pusher.trigger('balderah-notifications', `notify-${userId}`, { message });
    await Notification.create({ userId, message });
  }

  /**
   * @description this method is responsible for sending notifications for new articles
   * to the author's followers
   * @static
   * @param {number} authorId - id of article author
   * @returns {void}
   */
  static async newArticle(authorId) {
    const [userIds, message] = await Notifier.forNewArticle(authorId);
    const data = userIds.map(userId => ({ userId, message }));
    const unsubscribedUsers = await Notifier.getUnsubscribedUsers('app');
    const subUserIds = userIds.filter(userId => !unsubscribedUsers.includes(userId));
    const events = subUserIds.map(userId => ({
      channel: 'balderah-notifications',
      name: `notify-${userId}`,
      data: { message }
    }));
    pusher.triggerBatch(events);
    await Notification.bulkCreate(data);
  }

  /**
   * @description this method is responsible for sending notifications for new comments
   * @static
   * @param {id} articleId - id of article which has new comments
   * @returns {void}
   */
  static async newComment(articleId) {
    const [userIds, message] = await Notifier.forNewComment(articleId);
    const data = userIds.map(userId => ({ userId, message }));
    const unsubscribedUsers = await Notifier.getUnsubscribedUsers('app');
    const subUserIds = userIds.filter(userId => !unsubscribedUsers.includes(userId));
    const events = subUserIds.map(userId => ({
      channel: 'balderah-notifications',
      name: `notify-${userId}`,
      data: { message }
    }));
    pusher.triggerBatch(events);
    await Notification.bulkCreate(data);
  }

  /**
   * @description this method is responsible for getting all user notifications
   * @static
   * @param {object} request - the request object
   * @param {object} response - the response object
   * @returns {object} - the success or error response
   */
  static async getNotifications(request, response) {
    const userId = request.userData.payload.id;
    try {
      const notifications = await Notification.findAll({
        where: { userId },
        attributes: ['message', 'createdAt']
      });

      if (!notifications.length) {
        return response.status(404).json({
          status: 'Fail',
          message: 'This user has no notifications at this time'
        });
      }

      return response.status(200).json({
        status: 'Success',
        message: 'All notifications found successfully',
        notifications
      });
    } catch (error) {
      response.status(500).json(errorResponse([error.message]));
    }
  }
}

export default NotificationsController;
