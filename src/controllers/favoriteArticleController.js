import errorResponse from '../helpers/index';
import ArticleModel from '../helpers/articles';
import FavoriteModelHelper from '../helpers/favorite';
import logTracker from '../../logger/logTracker';

const errorMessage = 'Could not complete action at this time';

/**
 * @class FavoriteArticleController
 */
class FavoriteArticleController {
  /**
   *
   * @param {*} request - request object
   * @param {*} response - response object
   * @returns {void} - redirects to article page
   */
  static async favoriteArticle(request, response) {
    const { slug } = request.params;
    const userId = request.userData.payload.id;
    try {
      const articleId = (await ArticleModel.queryForArticle(slug)).id;
      await FavoriteModelHelper.favoriteArticle(articleId, userId);
      return response.status(200).json({
        message: 'Article favorited successully',
        favorited: true
      });
    } catch (error) {
      logTracker(error);
      response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
   *
   * @param {*} request - request object
   * @param {*} response - response object
   * @returns {void} - redirects to article page
   */
  static async unFavoriteArticle(request, response) {
    const { slug } = request.params;
    const userId = request.userData.payload.id;
    try {
      const articleId = (await ArticleModel.queryForArticle(slug)).id;
      await FavoriteModelHelper.unFavoriteArticle(articleId, userId);
      return response.status(200).json({
        message: 'Article unfavorited successully',
        favorited: false
      });
    } catch (error) {
      logTracker(error);
      response.status(500).json(errorResponse([errorMessage]));
    }
  }
}

export default FavoriteArticleController;
