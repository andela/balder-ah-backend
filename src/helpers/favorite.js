import models from '../db/models';

const { Favorite } = models;

/**
 * @class FavoriteModel
 */
class FavoriteModel {
  /**
   * @static
   * @param {number} articleId -id of article being favorited
   * @param {number} userId - id of user favoriting
   * @returns {void}
   * @memberof FavoriteModel
   */
  static async favoriteArticle(articleId, userId) {
    await Favorite.findOrCreate({ where: { articleId, userId }, defaults: { articleId, userId } });
  }

  /**
   * @static
   * @param {number} articleId - article id to check
   * @param {number} userId - user id who's checking
   * @returns {Boolean} - true if user has favorited the article
   */
  static async hasBeenFavorited(articleId, userId) {
    const favExists = await Favorite.findOne({
      where: { articleId, userId }
    });
    return !!favExists;
  }

  /**
   * @static
   * @param {number} articleId
   * @param {number} userId
   * @returns {void}
   */
  static async unFavoriteArticle(articleId, userId) {
    await Favorite.destroy({ where: { articleId, userId } });
  }
}

export default FavoriteModel;
