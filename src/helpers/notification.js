import sgMail from '@sendgrid/mail';
import models from '../db/models';

const { Article, User } = models;

const { SENDGRID_API_KEY, NOTIFICATIONS_EMAIL } = process.env;

/**
 * @class Notifier
 */
class Notifier {
  /**
   * @description gets all users from the database who do not want email/app notifications.
   * @static
   * @param {string} notifType - type of notification
   * @returns {object[]} - array of users who do not want to receive app/email notifications.
   */
  static async getUnsubscribedUsers(notifType) {
    if (notifType === 'email') {
      const users = (await User.findAll({ where: { emailNotifications: false } }))
        .map(user => user.email);
      return users;
    }
    const users = (await User.findAll({ where: { appNotifications: false } }))
      .map(user => user.id);
    return users;
  }

  /**
   * @description prepares message and dispatches email for a follower notification
   * @static
   * @param {string} emailOfFollowed - email address of author who was followed
   * @param {number} followerId - id of author who did the following
   * @returns {object[]} - array containing the notificaiton message
   */
  static async forNewFollower(emailOfFollowed, followerId) {
    const unsubscribedUsers = await this.getUnsubscribedUsers('email');
    const followerUsername = (await User.findByPk(followerId)).username;
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: emailOfFollowed,
      from: `${NOTIFICATIONS_EMAIL}`,
      subject: 'You have a new follower 🎉',
      html: `${followerUsername} just followed you.`
    };
    if (!unsubscribedUsers.includes(emailOfFollowed)) sgMail.send(msg);
    return [msg.html];
  }

  /**
   * @description prepares message and dispatches email for a comment notification
   * @static
   * @param {number} articleId - id of article which has new comments
   * @returns {object[]} - array contain an array of userIds who have favorited the article,
   * and the notificaiton message
   */
  static async forNewComment(articleId) {
    const unsubscribedUsers = await this.getUnsubscribedUsers('email');
    const article = await Article.findByPk(articleId, {
      include: [{
        association: 'favoritesCount',
        include: [{
          association: 'author'
        }]
      }]
    });

    const emailsOfFavoriters = article.favoritesCount
      .map(fav => fav.author.email)
      .filter(email => !unsubscribedUsers.includes(email));
    const idsOfFavoriters = article.favoritesCount
      .map(fav => fav.author.id);

    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: emailsOfFavoriters,
      from: `${NOTIFICATIONS_EMAIL}`,
      subject: 'New comment alert 🎊',
      html: `${article.title} has a new comment`
    };
    if (emailsOfFavoriters.length) sgMail.sendMultiple(msg);
    return [idsOfFavoriters, msg.html];
  }

  /**
   * @description prepares message and dispatches email for a new article notification
   * @static
   * @param {number} authorId - id of the new article's author
   * @returns {object[]} - array contain an array of userIds who follow the article author,
   * and the notificaiton message
   */
  static async forNewArticle(authorId) {
    const unsubscribedUsers = await this.getUnsubscribedUsers('email');
    const user = await User.findByPk(authorId, {
      include: [{ association: 'followers' }]
    });

    const authorFollowersEmails = user.followers
      .map(follower => follower.email)
      .filter(email => !unsubscribedUsers.includes(email));
    const authorFollowersIds = user.followers
      .map(follower => follower.id);
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: authorFollowersEmails,
      from: `${NOTIFICATIONS_EMAIL}`,
      subject: 'New article alert 🎉',
      html: `${user.username} just published a new article.`
    };

    if (authorFollowersEmails.length) sgMail.sendMultiple(msg);
    return [authorFollowersIds, msg.html];
  }
}

export default Notifier;
