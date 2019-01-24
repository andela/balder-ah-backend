import crypto from 'crypto';
import { generateToken } from '../middlewares/authentication';
import models from '../db/models';

const { User } = models;

/**
 * @description Social authentication controller
 * @class SocialAuthController
 */
class SocialAuthController {
  /**
   * @static
   *
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile - contains profile details gotten from google
   * @param {*} done - callback which return the user object
   *
   * @returns {*} - passes execution to next middleware on route path
   *
   * @memberof SocialAuthController
   */
  static googleCallback(accessToken, refreshToken, profile, done) {
    const {
      id,
      name,
      emails,
      photos
    } = profile;

    User.findOrCreate({
      where: {
        $or: [{ email: emails[0].value }, { googleid: id }]
      },
      defaults: {
        username: `${name.givenName}${id.slice(0, 6)}`.toLowerCase(),
        email: emails[0].value,
        googleid: id,
        password: crypto.randomBytes(20).toString('hex'),
        image: photos[0].value
      }
    }).spread((user, created) => {
      const userDetails = user.get({ plain: true });
      userDetails.isNewUser = created;
      return done(null, userDetails);
    });
  }

  /**
   * @static
   *
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile - contains profile details gotten from facebook
   * @param {*} done - callback which return the user object
   *
   * @returns {*} - passes execution to next middleware on route path
   *
   * @memberof SocialAuthController
   */
  static facebookCallback(accessToken, refreshToken, profile, done) {
    const {
      id,
      name,
      emails,
      photos
    } = profile;
    User.findOrCreate({
      where: {
        $or: [{ email: emails[0].value }, { facebookid: id }]
      },
      defaults: {
        username: `${name.givenName}${id.slice(0, 6)}`.toLowerCase(),
        email: emails[0].value,
        facebookid: id,
        password: crypto.randomBytes(20).toString('hex'),
        image: photos[0].value
      }
    }).spread((user, created) => {
      const userDetails = user.get({ plain: true });
      userDetails.isNewUser = created;
      return done(null, userDetails);
    });
  }

  /**
   * @static
   *
   * @param {*} token
   * @param {*} tokenSecret
   * @param {object} profile - contains profile details gotten from twitter
   * @param {*} done - callback which return the user object
   *
   * @returns {*} - passes execution to next middleware on route path
   *
   * @memberof SocialAuthController
   */
  static twitterCallback(token, tokenSecret, profile, done) {
    const {
      id,
      displayName,
      emails,
      photos
    } = profile;
    User.findOrCreate({
      where: {
        $or: [{ email: emails[0].value }, { twitterid: id }]
      },
      defaults: {
        username: `${displayName}${id.slice(0, 6)}`.toLowerCase(),
        email: emails[0].value,
        twitterid: id,
        password: crypto.randomBytes(20).toString('hex'),
        image: photos[0].value
      }
    }).spread((user, created) => {
      const userDetails = user.get({ plain: true });
      userDetails.isNewUser = created;
      return done(null, userDetails);
    });
  }

  /**
   * @static
   *
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   *
   * @returns {object} - object containing a generated token
   * @memberof SocialAuthController
   */
  static getToken(request, response) {
    const { id, username } = request.user;
    const payload = { id, username };
    const time = {};
    time.expiresIn = '240h';
    const token = generateToken(payload, time);
    return response.redirect(`${process.env.CLIENT_APP_URL}/social?token=${token}`);
  }
}

export default SocialAuthController;
